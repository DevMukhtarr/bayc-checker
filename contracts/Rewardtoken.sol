// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Rewardtoken is ERC20 {
    address public owner;
    constructor() {
        owner = msg.sender;
        _mint(msg.sender, 1000000000e18);
    }
}