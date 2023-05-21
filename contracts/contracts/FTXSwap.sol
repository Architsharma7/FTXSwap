// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

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
contract FTXSwap {
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
}
