// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721 {

    enum NftType { Static, Dynamic, Nested }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct NftData {
        NftType nftType;
        uint256 parentId;
        uint256[] childIds;
    }

    mapping(uint256 => NftData) private nftData;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}
        function createStaticNft(address _recipient, uint256 _tokenId) external {
        _safeMint(_recipient, _tokenId);
        nftData[_tokenId] = NftData(NftType.Static, 0, new uint256[](0));
    }

    function createDynamicNft(address _recipient) external returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(_recipient, tokenId);
        nftData[tokenId] = NftData(NftType.Dynamic, 0, new uint256[](0));
        return tokenId;
    }

    function createNestedNft(address _recipient, uint256 _parentId) external returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(_recipient, tokenId);
        nftData[tokenId] = NftData(NftType.Nested, _parentId, new uint256[](0));
        nftData[_parentId].childIds.push(tokenId);
        return tokenId;
    }

    function getChildNfts(uint256 _parentId) external view returns (uint256[] memory) {
        return nftData[_parentId].childIds;
    }

}