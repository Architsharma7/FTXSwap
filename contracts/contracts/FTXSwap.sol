// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
pragma abicoder v2;

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {ExpressExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/express/ExpressExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
// import {IERC20} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

import "./interfaces/Gelato/AutomateTaskCreator.sol";

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/interfaces/IQuoterV2.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

// Task
/** */
// Origin
// Swap function -- Called by the Contract user to intiate Swap
// SwapInLimit -- Called by the Contract user to intiate a Limit Swap

/***/
// Dest
// ExecuteSwap  -- Called by the Axelar Relayer to start the Swap (_swap)
// ExecuteLimitSwap --  Called by the Axelar Relayer to record the limit order and Create a Gelato Task
// Exectue Gealto Task --  Called by Gelato relayer on fulfilling the conditions , to call _swap
// CheckTask -- called by gelato to check the limit order condition , returns true or false

/***/
// Extras
// _swap -- Actual Swap function internal , exectue the swap with exchange contract
// _createTask -- Create Gelato Task after recieving the req
// _callContractWithAxelar --send the call to axelar Relayer to send the message cross chain
// _callContractTokenWithAxelar -- send the call along witht he tokens to the axelar Relayer to send the message with tokens cross the chains

// Extra functions around funds withdrawl and deposit

// Acess Control Functions
// change the External Contract Addresses like Axelar , Exchange and Gelato Relayer
// Owner restrictions

contract FTXSwap is ExpressExecutable, AutomateTaskCreator {
    IAxelarGasService public immutable gasService;
    ISwapRouter public immutable swapRouter;
    IQuoterV2 public immutable quoter;
    uint24 public constant poolFee = 3000;
    uint160 sqrtPriceLimitX96 = 0;
    // address public immutable gatewayAddress;

    struct LimitOrder {
        address tokenIn;
        address tokenOut;
        uint amountIn;
        uint limitPrice;
        address recepient;
        bytes32 taskId;
        bool executed;
    }

    uint public limitOrderCounter;
    mapping(uint => LimitOrder) public limitOrders;

    event limitOrderTaskCreated(uint orderId, bytes32 taskId);

    constructor(
        address gateway_,
        address gasReceiver_,
        address payable _automate,
        address _fundsOwner,
        address _swapRouter,
        address _quoterv2
    ) ExpressExecutable(gateway_) AutomateTaskCreator(_automate, _fundsOwner) {
        gasService = IAxelarGasService(gasReceiver_);
        swapRouter = ISwapRouter(_swapRouter);
        quoter = IQuoterV2(_quoterv2);
    }

    /*///////////////////////////////////////////////////////////////
                            Origin Chain Functions
    //////////////////////////////////////////////////////////////*/

    function SwapOnUniswap(
        string memory destinationChain,
        string memory destinationAddress,
        address tokenIn,
        address tokenOut,
        uint amountIn,
        string memory symbol
    ) external payable {
        // /// take the token from the user and transfer it to this contract
        // TransferHelper.safeTransferFrom(tokenIn, address(this), amountIn);
        // /// then approve it for the axelar gateway contract
        // TransferHelper.safeApprove(tokenIn, gateway, amountIn);

        // prepare the payload and send the call
        require(msg.value > 0, "Need to pay for gas");
        bytes memory payload = abi.encode(
            tokenIn,
            tokenOut,
            msg.sender,
            amountIn
        );
        if (msg.value > 0) {
            gasService.payNativeGasForExpressCallWithToken{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amountIn,
                msg.sender
            );
        }
        _callContractWithToken(
            destinationChain,
            destinationAddress,
            msg.sender,
            payload,
            symbol,
            amountIn
        );
    }

    function LimitSwapOnUniswap(
        string memory destinationChain,
        string memory destinationAddress,
        address tokenIn,
        address tokenOut,
        uint amountIn,
        uint limitPrice,
        string memory symbol
    ) external payable {
        require(msg.value > 0, "Need to pay for gas");
        bytes memory payload = abi.encode(
            tokenIn,
            tokenOut,
            msg.sender,
            amountIn,
            limitPrice
        );
        if (msg.value > 0) {
            gasService.payNativeGasForExpressCallWithToken{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amountIn,
                msg.sender
            );
        }
        _callContractWithToken(
            destinationChain,
            destinationAddress,
            msg.sender,
            payload,
            symbol,
            amountIn
        );
    }

    /*///////////////////////////////////////////////////////////////
                            Destination Chain functions
    //////////////////////////////////////////////////////////////*/

    // Executing the Swap on Uniswap
    function executeSwap(
        address tokenIn,
        address tokenOut,
        address recepient,
        uint256 amountIn
    ) internal {
        // this contract has the tokenIn with the amountIn
        // also check what token you received , not the wrapped axelar ones
        _swapUniswapSingle(tokenIn, tokenOut, recepient, amountIn);
    }

    function exectueLimitSwap(
        address tokenIn,
        address tokenOut,
        address recepient,
        uint256 amountIn,
        uint256 limitPrice
    ) internal {
        /// store the limit order Info
        limitOrderCounter += 1;
        uint limitOrderId = limitOrderCounter;
        limitOrders[limitOrderId] = LimitOrder(
            tokenIn,
            tokenOut,
            amountIn,
            limitPrice,
            recepient,
            0,
            false
        );
        /// create the gelato Task

        createTask(limitOrderId);
    }

    function executeGelatoTask(uint orderId) public onlyDedicatedMsgSender {
        LimitOrder memory _limitOrder = limitOrders[orderId];

        require(!_limitOrder.executed, "Order already executed");

        _swapUniswapSingle(
            _limitOrder.tokenIn,
            _limitOrder.tokenOut,
            _limitOrder.recepient,
            _limitOrder.amountIn
        );
    }

    // Prepare the right payload with the proper inputs for executing the limitSwap
    function checker(
        uint orderId
    ) external  returns (bool canExec, bytes memory execPayload) {
        LimitOrder memory _limitOrder = limitOrders[orderId];
        uint amountPrice = 1 ether;

        /// fetching the price for 1
        (uint256 amountOut, , , ) = _quoteSwapSingle(
            _limitOrder.tokenIn,
            _limitOrder.tokenOut,
            amountPrice
        );

        canExec = (amountOut == _limitOrder.limitPrice) ? true : false;
        if (canExec) {
            execPayload = abi.encodeCall(this.executeGelatoTask, (orderId));
        } else {
            execPayload = abi.encode("Price Not matched");
        }
    }

    /*///////////////////////////////////////////////////////////////
                           Axelar executions
    //////////////////////////////////////////////////////////////*/

    // send gas with this call
    function _callContractWithToken(
        string memory destinationChain,
        string memory destinationAddress,
        address recepient,
        bytes memory payload,
        string memory symbol,
        uint256 amount
    ) internal {
        address tokenAddress = gateway.tokenAddresses(symbol);
        // IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        TransferHelper.safeTransferFrom(tokenAddress, recepient , address(this), amount);
        // IERC20(tokenAddress).approve(address(gateway), amount);
        TransferHelper.safeApprove(tokenAddress, address(gateway), amount);
        gateway.callContractWithToken(
            destinationChain,
            destinationAddress,
            payload,
            symbol,
            amount
        );
    }

    // Called by the Axelar Gating contracts
    function _executeWithToken(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        (
            address tokenIn,
            address tokenOut,
            address recepient,
            uint amountIn,
            uint limitPrice
        ) = abi.decode(payload, (address, address, address, uint, uint));
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);
        require(amountIn == amount, "Sent amount not correct");
        if (limitPrice!= 0) {
            exectueLimitSwap(
                tokenIn,
                tokenOut,
                recepient,
                amountIn,
                limitPrice
            );
        } else {
            executeSwap(tokenIn, tokenOut, recepient, amountIn);
        }
    }

    /*///////////////////////////////////////////////////////////////
                           Gelato executions
    //////////////////////////////////////////////////////////////*/

    function depositForFees() external payable {
        _depositFunds(msg.value, ETH);
    }

    // we might need to pass extra args to create and store the TaskId
    function createTask(uint orderId) internal {
        ModuleData memory moduleData = ModuleData({
            modules: new Module[](3),
            args: new bytes[](3)
        });

        moduleData.modules[0] = Module.RESOLVER;
        moduleData.modules[1] = Module.PROXY;
        moduleData.modules[2] = Module.SINGLE_EXEC;


        // we can pass any arg we want in the encodeCall
        moduleData.args[0] = _resolverModuleArg(
            address(this),
            abi.encodeCall(this.checker, (orderId))
        );
        moduleData.args[1] = _proxyModuleArg();
        moduleData.args[2] = _singleExecModuleArg();

        bytes32 taskId = _createTask(
            address(this),
            abi.encode(this.executeGelatoTask.selector),
            moduleData,
            address(0)
        );

        limitOrders[orderId].taskId = taskId;
        /// Here we just pass the function selector we are looking to execute

        emit limitOrderTaskCreated(orderId, taskId);
    }

    // the args will be decided on the basis of the web3 function we create and the task we add
    // @note - not ready to use , as we need to use a differnt Automate Contract for that
    function createFunctionTask(
        string memory _web3FunctionHash,
        bytes calldata _web3FunctionArgsHex
    ) internal {
        ModuleData memory moduleData = ModuleData({
            modules: new Module[](2),
            args: new bytes[](2)
        });

        moduleData.modules[0] = Module.PROXY;
        moduleData.modules[1] = Module.WEB3_FUNCTION;

        moduleData.args[0] = _proxyModuleArg();
        moduleData.args[1] = _web3FunctionModuleArg(
            _web3FunctionHash,
            _web3FunctionArgsHex
        );

        bytes32 id = _createTask(
            address(this),
            abi.encode(this.executeGelatoTask.selector),
            moduleData,
            address(0)
        );
        /// log the event with the Gelaot Task ID
        /// Here we just pass the function selector we are looking to execute
    }

    /*///////////////////////////////////////////////////////////////
                           Uniswap functions
    //////////////////////////////////////////////////////////////*/

    function _swapUniswapSingle(
        address tokenIn,
        address tokenOut,
        address recepient,
        uint256 amountIn
    ) internal returns(uint amountOut) {
        // Approve the router to spend the token
        TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: recepient,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }

    function _swapUniswapMulti(
        bytes memory path,
        address recepient,
        uint256 amountIn
    ) internal returns (uint amountOut) {
        // Approve the router to spend DAI.
        // TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);
        // path: abi.encodePacked(DAI, poolFee, USDC, poolFee, WETH9),
        ISwapRouter.ExactInputParams memory params = ISwapRouter
            .ExactInputParams({
                path: path,
                recipient: recepient,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0
            });

        // Executes the swap.
        amountOut = swapRouter.exactInput(params);
    }

    function _quoteSwapMulti(
        bytes memory path,
        uint256 amountIn
    )
        internal
        returns (
            uint256 amountOut,
            uint160[] memory sqrtPriceX96AfterList,
            uint32[] memory initializedTicksCrossedList,
            uint256 gasEstimate
        )
    {
        (
            amountOut,
            sqrtPriceX96AfterList,
            initializedTicksCrossedList,
            gasEstimate
        ) = quoter.quoteExactInput(path, amountIn);
    }

    function _quoteSwapSingle(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    )
        internal
        returns (
            uint256 amountOut,
            uint160 sqrtPriceX96After,
            uint32 initializedTicksCrossed,
            uint256 gasEstimate
        )
    {

        IQuoterV2.QuoteExactInputSingleParams memory params = IQuoterV2.QuoteExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amountIn: amountIn,
            fee: poolFee,
            sqrtPriceLimitX96: sqrtPriceLimitX96
        });
        
        (
            amountOut,
            sqrtPriceX96After,
            initializedTicksCrossed,
            gasEstimate
        ) = quoter.quoteExactInputSingle(params);
    }
}

/* Alternative methods to pay gas fees */
//This method accepts the native tokens of the source chain.
// function payNativeGasForContractCallWithToken(
//   address sender,
//   string calldata destinationChain,
//   string calldata destinationAddress,
//   bytes calldata payload,
//   address refundAddress
// )

//This method receives any tokens for the relayer fee.
//         function payGasForContractCallWithToken(
//     address sender,
//     string calldata destinationChain,
//     string calldata destinationAddress,
//     bytes calldata payload,
//     string calldata symbol,
//     uint256 amount,
//     address gasToken,
//     uint256 gasFeeAmount,
//     address refundAddress
// )
