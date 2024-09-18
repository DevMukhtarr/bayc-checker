// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Claimtoken {
    IERC20 public immutable tokenAddress;
    bytes32 merkleRoot;
    address public owner; 

    mapping (address => bool) claimedAirdrop;

    event AirdropClaimed(address holder, uint256 time);

    modifier onlyOwner () {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor(address _tokenAddress, bytes32 _merkleRoot) {
        owner = msg.sender;
        merkleRoot = _merkleRoot;
        tokenAddress = IERC20(_tokenAddress);
    }

    function claimAirdrop (bytes32[] memory _merkleProof, uint256 _amount, string PendingBalanceUpdate) public {
        require(msg.sender != address(0), "Address zero detected");
        require(!claimedAirdrop[msg.sender], "Airdrop claimed already");

        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount, PendingBalanceUpdate));

        IERC20(_tokenAddress).transferFrom
    }


}