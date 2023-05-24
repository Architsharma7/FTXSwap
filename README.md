# FTXSwap

## Introduction
Cross Chain Asset Limit orders Protocol using Axelar and Automation with Gelato

## Our Experiencing building with Axelar

# Postive
- For buildig cross chains dApps, The true potential of axelar comes to play. We were amazed how simple it was to send message to another chain with just a single contract call , along with asset bridgning in seconds.  FVM has no cross chain messaging protocol , 

-  The Axelar Scan was also a good addtion to monitor our calls and exectuion in real time , it also reflected the error properly instead of cancelling the transcation and giving the chance to exectue them if gas fees comes out as low.

# Problems we faced
- The Major issue was precalculating gasfees , we were struggling to figure out the way to calaculate the whole gas for the full call execution beforehand sendingthe callContractWithToken call. We tried several methods ,but then had to use the Axelar SDK to calculate the same

- Another challenge was to manage the tokens and assets with their info on multiple chains , as we had to record the whole list for all the chains . 

## Team

- Archit : @architSharma7
- Dhruv : @dhruv-2003
