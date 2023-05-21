// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {ExpressExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/express/ExpressExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IERC20} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

import "./interfaces/Gelato/AutomateTaskCreator.sol";

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

contract FTXSwap is ExpressExecutable {
    IAxelarGasService public immutable gasService;

    constructor(
        address gateway_,
        address gasReceiver_,
        address payable _automate,
        address _fundsOwner
    ) ExpressExecutable(gateway_) AutomateTaskCreator(_automate, _fundsOwner) {
        gasService = IAxelarGasService(gasReceiver_);
    }

    /*///////////////////////////////////////////////////////////////
                            Origin Chain Functions
    //////////////////////////////////////////////////////////////*/

    function Swap() external payable {
        _callContractWithToken();
    }

    function LimitSwap() external payable {}

    /*///////////////////////////////////////////////////////////////
                            Destination Chain functions
    //////////////////////////////////////////////////////////////*/

    function executeSwap() external {}

    function exectueLimitSwap() external {}

    function executeGelatoTask() external {}

    /*///////////////////////////////////////////////////////////////
                           Axelar executions
    //////////////////////////////////////////////////////////////*/

    function _callContractWithToken(
        string memory destinationChain,
        string memory destinationAddress,
        bytes memory payload,
        string memory symbol,
        uint256 amount
    ) external payable {
        address tokenAddress = gateway.tokenAddresses(symbol);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenAddress).approve(address(gateway), amount);
        if (msg.value > 0) {
            gasService.payNativeGasForExpressCallWithToken{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amount,
                msg.sender
            );
        }
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
        string calldata,
        string calldata,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        address[] memory recipients = abi.decode(payload, (address[]));
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);

        address recipient = abi.decode(payload, (address));

        address tokenAddress = gateway.tokenAddresses(tokenSymbol);

        IERC20(tokenAddress).transfer(recipient, amount);
    }

    /*///////////////////////////////////////////////////////////////
                           Gelato executions
    //////////////////////////////////////////////////////////////*/

    // we might need to pass extra args to create and store the TaskId
    function createTask() internal {
        ModuleData memory moduleData = ModuleData({
            modules: new Module[](2),
            args: new bytes[](2)
        });

        moduleData.modules[0] = Module.RESOLVER;
        moduleData.modules[1] = Module.PROXY;

        // we can pass any arg we want in the encodeCall
        moduleData.args[0] = _resolverModuleArg(
            address(this),
            abi.encodeCall(this.checker, ())
        );
        moduleData.args[1] = _proxyModuleArg();

        bytes32 id = _createTask(
            address(this),
            abi.encode(this.executeGelatoTask.selector),
            moduleData,
            ETH
        );
        /// Here we just pass the function selector we are looking to execute
    }

    // Prepare the right payload with the proper inputs for executing the limitSwap
    function checker()
        external
        view
        returns (bool canExec, bytes memory execPayload)
    {
        uint256 lastExecuted = counter.lastExecuted();

        canExec = (block.timestamp - lastExecuted) > 180;

        execPayload = abi.encodeCall(this.executeGelatoTask, ());
    }
}
