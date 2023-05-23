// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {ExpressExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/express/ExpressExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
// import {IERC20} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
 
contract FTXSwapFVM is ExpressExecutable {
    IAxelarGasService public immutable gasService;

    constructor(
        address gateway_,
        address gasReceiver_
    ) ExpressExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
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
            payload,
            symbol,
            amountIn
        );
    }

    /*///////////////////////////////////////////////////////////////
                           Axelar executions
    //////////////////////////////////////////////////////////////*/

    // send gas with this call
    function _callContractWithToken(
        string memory destinationChain,
        string memory destinationAddress,
        bytes memory payload,
        string memory symbol,
        uint256 amount
    ) internal {
        address tokenAddress = gateway.tokenAddresses(symbol);
        // IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        TransferHelper.safeTransferFrom(
            tokenAddress,
            msg.sender,
            address(this),
            amount
        );
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
}
