// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Name {
    IERC20 public immutable tokenAddress;
    constructor(address _tokenAddress, bytes32 _merkleRoot) {
        owner = msg.sender;
        merkleRoot = _merkleRoot;
        tokenAddress = IERC20(_tokenAddress);
    }
}