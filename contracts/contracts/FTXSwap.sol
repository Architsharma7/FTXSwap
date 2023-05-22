// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {ExpressExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/express/ExpressExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IERC20} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

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

//@dev : link for interfaces https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/tree/main/contracts/interfaces

contract FTXSwap is ExpressExecutable {
    // Interface axelar;
    // constructor(address axelar) {
    //     axelar = Interface(axelar);
    // }
    // function _callContractWithToken() internal {
    //     axelar.callContractWithToken()
    // }
    //@note
    // function swap() external {
    // }

    IAxelarGasService public immutable gasService;

    constructor(
        address gateway_,
        address gasReceiver_
    ) ExpressExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
    }

    function _callContractWithToken(
        string memory destinationChain,
        string memory destinationAddress,
        address[] calldata destinationAddresses,
        string memory symbol,
        uint256 amount
    ) external payable {
        address tokenAddress = gateway.tokenAddresses(symbol);
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        IERC20(tokenAddress).approve(address(gateway), amount);
        bytes memory payload = abi.encode(destinationAddresses);
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

    function _swap() internal payable {
        _callContractWithToken();
    }


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