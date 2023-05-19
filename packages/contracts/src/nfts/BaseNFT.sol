// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CombinableNFT is ERC721URIStorage, Ownable {
    uint256 public totalSupply;

    struct BaseAttributes {
        uint256 atk; // attack
        uint256 def; //defense
        uint256 hp; //hit points
        uint256 mp; //magic Point
        uint256 spd; //speed
        uint256 amtr; //antimatter
        uint256 dama; //dark matter
    }

    mapping(uint256 => BaseAttributes) private _baseAttributes;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint() public onlyOwner {
        uint256 tokenId = totalSupply + 1;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://Qm", bytes32(bytes20(blockhash(block.number - 1)))))); // use IPFS data for token URI

        BaseAttributes memory attributes;
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))) % 7;
        if (randomIndex == 0) {
            attributes.atk = 1;
        } else if (randomIndex == 1) {
            attributes.def = 1;
        } else if (randomIndex == 2) {
            attributes.hp = 1;
        } else if (randomIndex == 3) {
            attributes.mp = 1;
        } else if (randomIndex == 4) {
            attributes.spd = 1;
        } else if (randomIndex == 5) {
            attributes.amtr = 1;
        } else {
            attributes.dama = 1;
        }

        _baseAttributes[tokenId] = attributes;
        totalSupply++;
    }

    function getAttributes(uint256 tokenId) public view returns (BaseAttributes memory) {
        require(_exists(tokenId), "Token does not exist");
        return _baseAttributes[tokenId];
    }
}
