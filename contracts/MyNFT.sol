// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function batchMint(address[] memory _recipients, uint256[] memory _tokenIds) external {
        require(_recipients.length == _tokenIds.length, "MyNFT: Recipients and TokenIds length mismatch");
        for (uint256 i = 0; i < _recipients.length; i++) {
            _safeMint(_recipients[i], _tokenIds[i]);
        }
    }
}