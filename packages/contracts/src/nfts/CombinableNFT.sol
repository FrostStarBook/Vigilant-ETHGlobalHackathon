// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract CombinableNFT is Initializable, ERC721URIStorageUpgradeable, OwnableUpgradeable{
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

  event NFTMinted(
    uint256 tokenId,
    uint256 atk,
    uint256 def,
    uint256 hp,
    uint256 mp,
    uint256 spd,
    uint256 amtr,
    uint256 dama
  );

   function initialize() initializer public {
        __ERC721_init("MyNFT", "MNFT");
        __ERC721URIStorage_init();
        __Ownable_init();
    }

  function mint(address to, string memory tokenURI) public onlyOwner {
    uint256 tokenId = totalSupply + 1;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);

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
    emit NFTMinted(
      tokenId,
      attributes.atk,
      attributes.def,
      attributes.hp,
      attributes.mp,
      attributes.spd,
      attributes.amtr,
      attributes.dama
    );
  }

  function getAttributes(uint256 tokenId) public view returns (BaseAttributes memory) {
    require(_exists(tokenId), "Token does not exist");
    return _baseAttributes[tokenId];
  }

  function mintCombineNFT(uint256[] memory tokenIds,address to, string memory tokenURI) public returns (uint256) {
    BaseAttributes memory combinedAttribute = _baseAttributes[tokenIds[0]];
    for (uint256 i = 1; i < tokenIds.length; i++) {
      BaseAttributes memory currentNFT = _baseAttributes[tokenIds[i]];
      combinedAttribute.atk += currentNFT.atk;
      combinedAttribute.def += currentNFT.def;
      combinedAttribute.hp += currentNFT.hp;
      combinedAttribute.mp += currentNFT.mp;
      combinedAttribute.spd += currentNFT.spd;
      combinedAttribute.amtr += currentNFT.amtr;
      combinedAttribute.dama += currentNFT.dama;
    }

    uint256 tokenId = totalSupply + 1;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);
    emit NFTMinted(
      tokenId,
      combinedAttribute.atk,
      combinedAttribute.def,
      combinedAttribute.hp,
      combinedAttribute.mp,
      combinedAttribute.spd,
      combinedAttribute.amtr,
      combinedAttribute.dama
    );
    return tokenId;
  }
}
