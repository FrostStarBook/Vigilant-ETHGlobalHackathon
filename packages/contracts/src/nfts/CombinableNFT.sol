// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract CombinableNFT is
  Initializable,
  UUPSUpgradeable,
  ERC721Upgradeable,
  ERC721URIStorageUpgradeable,
  OwnableUpgradeable
{
  uint256 public totalSupply;

  function initialize() public initializer {
    __ERC721_init("BaseNFT", "BNFT");
    __ERC721URIStorage_init();
    __Ownable_init();
    __UUPSUpgradeable_init();
  }

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

  function mint(
    address to,
    string memory description,
    string memory mintType
  ) external onlyOwner{
    uint256 tokenId = totalSupply + 1;

    BaseAttributes memory attributes;
     string memory images;

     if (keccak256(bytes(mintType)) == keccak256(bytes("atk"))) {
      attributes.atk = 1;
      images = "https://bafybeifwe2xkzzbm4ck4rtd3cfm3q6ramzbuyemjfkienem36s22jrcxzy.ipfs.nftstorage.link/";
    } else if (keccak256(bytes(mintType)) == keccak256(bytes("def"))) {
      attributes.def = 1;
      images = "https://bafybeif2es67pmfbrwbgnzs72bk5ut5giadhetjetqw4d7pnwyt2436jzm.ipfs.nftstorage.link/";
    } else if (keccak256(bytes(mintType)) == keccak256(bytes("hp"))) {
      attributes.hp = 1;
      images = "https://bafybeict26fwlgkt7arhmw5mwwjujqzxy4d5e6mrynztogmkmt6la7utfu.ipfs.nftstorage.link/";
    } else if (keccak256(bytes(mintType)) == keccak256(bytes("mp"))) {
      attributes.mp = 1;
      images = "https://bafybeihbd7tmefhymcun7qs2guy5chooeiaqjmucib76kz4ct6qapok7mq.ipfs.nftstorage.link/";
    } else if (keccak256(bytes(mintType)) == keccak256(bytes("spd"))) {
      attributes.spd = 1;
      images = "https://bafybeifb44ejrc65sd7ebrf624poyyzan2xchkyvoz4erhrzl2plm7j53y.ipfs.nftstorage.link/";
    } else if (keccak256(bytes(mintType)) == keccak256(bytes("amtr"))) {
      attributes.amtr = 1;
      images = "https://bafybeien76xaw3kv67lp4uazqgvvvql3wp7pkeq2tl64q7xukteyjxjvt4.ipfs.nftstorage.link/";
    } else {
      attributes.dama = 1;
      images = "https://bafybeig7b6vs4wf7eyvxjq5yfteozyg2xshh4mh6bzi5ohcgimwsms7rj4.ipfs.nftstorage.link/";
    }
    _baseAttributes[tokenId] = attributes;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, tokenURI(tokenId, description, images));

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

  function mintCombineNFT(
    uint256[] memory tokenIds,
    address to,
    string memory description,
    string memory images
  ) external onlyOwner returns (uint256) {
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
    _baseAttributes[tokenId] = combinedAttribute;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, tokenURI(tokenId, description, images));
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

  function tokenURI(
    uint256 tokenId,
    string memory description,
    string memory images
  ) internal view returns (string memory) {
    require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

    BaseAttributes memory attributes = _baseAttributes[tokenId];

    string memory json = string(
      abi.encodePacked(
        "{",
        '"name": "Vigilant Base NFT #',
        Strings.toString(tokenId),
        '",',
        '"description": "',
        description,
        '",',
        '"attributes": [',
        '{ "trait_type": "atk", "value": ',
        Strings.toString(attributes.atk),
        " },",
        '{ "trait_type": "def", "value": ',
        Strings.toString(attributes.def),
        " },",
        '{ "trait_type": "hp", "value": ',
        Strings.toString(attributes.hp),
        " },",
        '{ "trait_type": "mp", "value": ',
        Strings.toString(attributes.mp),
        " },",
        '{ "trait_type": "spd", "value": ',
        Strings.toString(attributes.spd),
        " },",
        '{ "trait_type": "amtr", "value": ',
        Strings.toString(attributes.amtr),
        " },",
        '{ "trait_type": "dama", "value": ',
        Strings.toString(attributes.dama),
        " }",
        "],",
        '"image": "',
        images,
        '",',
        '"background_color": "FFFFFF"',
        "}"
      )
    );

    return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
  }

  function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

  function _burn(uint256 id) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
    super._burn(id);
  }

  function tokenURI(
    uint256 id
  ) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
    return super.tokenURI(id);
  }
}
