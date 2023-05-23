// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { PlayerComponent,PlayerInfoComponent,ObstructionComponent,PositionComponent,MapComponent,TestComponent,NFTComponent } from "../codegen/Tables.sol";
import { LibGame } from "../libraries/libGame.sol";
import { LibMap } from "../libraries/libMap.sol";
import { PlayerState } from "../codegen/Types.sol";
import { Perlin } from "../libraries/Perlin.sol";
//import { Perlin } from "@latticexyz/noise/contracts/Perlin.sol";
import { CombinableNFT } from "../nfts/CombinableNFT.sol";

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GameSystem is System {

    function JoinGame(int256 x, int256 y) public {
        bytes32 playerEntity = LibGame.addressToEntityKey(address(_msgSender()));
        bool ret = PlayerComponent.get(playerEntity);
        require(!ret,"already join game!");


        bytes32 position = LibGame.positionToEntityKey(x, y);
        require(!ObstructionComponent.get(position), "this space is obstructed");

        PlayerComponent.set(playerEntity,true);
        uint256 energy = 200;

        PlayerInfoComponent.set(playerEntity,0,block.timestamp,PlayerState.Rest,energy);
        PositionComponent.set(playerEntity,x,y);
        ObstructionComponent.set(position,true);

    }
    function Move(int256 x, int256 y) public{
        bytes32 playerEntity = LibGame.addressToEntityKey(address(_msgSender()));
        bool ret = PlayerComponent.get(playerEntity);
        require(ret,"player not init!");

        PlayerState state = PlayerInfoComponent.getState(playerEntity);
        require(state == PlayerState.Rest,"player is not rest!");

        bytes32 position = LibGame.positionToEntityKey(x, y);
        require(!ObstructionComponent.get(position), "this space is obstructed");


        uint256 dis = checkDis(playerEntity,x,y);

        uint256 time = PlayerInfoComponent.getUpdateTimestamp(playerEntity);
        uint256 restoreEnergy = MapComponent.getRestoreEnergy();
        uint256 maxEnergy = MapComponent.getEnergyMax();
        uint256 energyResume = ((block.timestamp-time)*restoreEnergy)/3600;

        //cal cost
        uint256 moveCost = MapComponent.getMoveCost();
        uint256 curEnergy = PlayerInfoComponent.getEnergy(playerEntity)+energyResume;
        curEnergy = curEnergy > maxEnergy?maxEnergy:curEnergy;
        require(curEnergy >= moveCost*dis, "energy limit");

        //update
        releaseObstruction(playerEntity);

        ObstructionComponent.set(position,true);
        PositionComponent.set(playerEntity,x,y);
        PlayerInfoComponent.setEnergy(playerEntity,curEnergy-moveCost*dis);
        PlayerInfoComponent.setUpdateTimestamp(playerEntity,block.timestamp);
    }
    function getAttribute(bytes32 playerEntity)internal returns (int64){
        int256 blockSize = MapComponent.getBlockSize();
        int256 x =  PositionComponent.getX(playerEntity)*blockSize;
        int256 y =  PositionComponent.getY(playerEntity)*blockSize;
        int256 seed =  MapComponent.getSeed();
        int256 denom =  MapComponent.getDenom();
        int128 perlin =  Perlin.noise(x,y,seed,denom,64)/(2*10**18);
        if(perlin < 3){
            return 3;
        }else if(perlin < 4){
            return 4;
        }else if(perlin < 5){
            return 5;
        }else if(perlin < 6){
            return 6;
        }else if(perlin < 7){
            return 7;
        }
        return 3;
        /*
        if(perlin < 3){
            return "hp";
         }else if(perlin < 4){
            return "atk";
         }else if(perlin < 5){
            return "def";
         }else if(perlin < 6){
            return "spd";
         }else if(perlin < 7){
           return "mp";
         }
           return "hp";
           */
    }
    function Gain() public{
        bytes32 playerEntity = LibGame.addressToEntityKey(address(_msgSender()));
        bool ret = PlayerComponent.get(playerEntity);
        require(ret,"player not init!");

        uint64 exploreBlock = PlayerInfoComponent.getExploreBlock(playerEntity);
        uint64 limit = MapComponent.getExploreBlockLimit();
        // require(exploreBlock >= block.number+limit,"block limit!");

        // if(exploreBlock > block.number - 256){
        //  uint256 targetTime = MapComponent.getExploreTime()+block.timestamp;
        //   PlayerInfoComponent.setExploreBlock(playerEntity,uint64(block.number+limit));
        //    return;
        //  }

        uint128 rand =  uint128(uint256(blockhash(exploreBlock))%(2**128-1));
        bool randRet = rand%2 == 0;
        if(randRet){
            int64 attr = getAttribute(playerEntity);
            AddPlayerNFT(playerEntity,attr);
            // CombinableNFT(address(this)).mint(msg.sender,LibGame.byte32ToString(attr));
        }

        PlayerInfoComponent.setState(playerEntity,PlayerState.Rest);
        PlayerInfoComponent.setUpdateTimestamp(playerEntity,block.timestamp);

    }
    function AddPlayerNFT(bytes32 entity,int64 attr)internal{
        if (attr == 3) {
            int64 hp = NFTComponent.getHp(entity);
            NFTComponent.setHp(entity,hp+1);
        } else if (attr == 4) {
            int64 atk = NFTComponent.getAtk(entity);
            NFTComponent.setAtk(entity,atk+1);
        }else if (attr == 5) {
            int64 def = NFTComponent.getDef(entity);
            NFTComponent.setDef(entity,def+1);
        }
        else if (attr == 6) {
            int64 spd = NFTComponent.getSpd(entity);
            NFTComponent.setSpd(entity,spd+1);
        }
        else if (attr == 7) {
            int64 mp = NFTComponent.getMp(entity);
            NFTComponent.setMp(entity,mp+1);
        }
    }
    function Explore() public{
        bytes32 playerEntity = LibGame.addressToEntityKey(address(_msgSender()));
        bool ret = PlayerComponent.get(playerEntity);
        require(ret,"player not init!");

        PlayerState state = PlayerInfoComponent.getState(playerEntity);
        require(state == PlayerState.Rest,"player state error!");

        uint64 exploreBlock =  uint64(block.number)+MapComponent.getExploreBlockLimit();

        PlayerInfoComponent.setState(playerEntity,PlayerState.Exploring);
        PlayerInfoComponent.setExploreBlock(playerEntity,exploreBlock);
    }
    function checkDis(bytes32 entity,int256 x,int256 y)internal returns(uint256) {
        int256 fromX =  PositionComponent.getX(entity);
        int256 fromY =  PositionComponent.getY(entity);
        //cal dis
        uint256 dis = uint256(LibMap.distance(fromX,fromY,x,y));
        uint256 stepLimit = MapComponent.getStepLimit();
        require(dis <= stepLimit, "step limit");
        return dis;
    }
    function releaseObstruction(bytes32 entity)internal returns(uint256) {
        int256 fromX =  PositionComponent.getX(entity);
        int256 fromY =  PositionComponent.getY(entity);
        bytes32 oldPosition = LibGame.positionToEntityKey(fromX,fromY);
        ObstructionComponent.set(oldPosition,false);
    }
}
