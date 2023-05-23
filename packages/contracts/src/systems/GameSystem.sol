// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { PlayerComponent,PlayerInfoComponent,ObstructionComponent,PositionComponent,MapComponent,TestComponent } from "../codegen/Tables.sol";
import { LibGame } from "../libraries/libGame.sol";
import { LibMap } from "../libraries/libMap.sol";
import { PlayerState } from "../codegen/Types.sol";
import { Perlin } from "../libraries/Perlin.sol";
//import { Perlin } from "@latticexyz/noise/contracts/Perlin.sol";
//import { CombinableNFT } from "../nfts/CombinableNFT.sol";

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
    function getAttribute(int256 x,int256 y,int256 seed,int256 denom , uint8 precision)internal returns (string memory){
        int128 perlin =  Perlin.noise(x,y,seed,denom,precision)/(2*10**18);
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
    }
    function Gain() public{
        bytes32 playerEntity = LibGame.addressToEntityKey(address(_msgSender()));
        bool ret = PlayerComponent.get(playerEntity);
        require(ret,"player not init!");

        uint256 targetTime = PlayerInfoComponent.getUpdateTimestamp(playerEntity);
        require(targetTime >= block.timestamp,"time limit!");

        uint256 exploreBlock = PlayerInfoComponent.getExploreBlock(playerEntity);

        if(exploreBlock < block.number - 256){

            // uint256 targetTime = MapComponent.getExploreTime()+block.timestamp;
            // PlayerInfoComponent.setState(playerEntity,PlayerState.Exploring);
            //PlayerInfoComponent.setExploreBlock(playerEntity,block.number+20);
            return;
        }

        int256 x =  PositionComponent.getX(playerEntity)*64;
        int256 y =  PositionComponent.getY(playerEntity)*64;
        int256 seed =  MapComponent.getSeed();
        int256 denom =  MapComponent.getDenom();
        uint8 precision =  uint8(MapComponent.getPrecision());
        string memory attr =  getAttribute(x, y, seed, denom, precision);


        //string memory attr = getAttribute(x,y,seed,denom,precision);



        PlayerInfoComponent.setState(playerEntity,PlayerState.Rest);
        PlayerInfoComponent.setUpdateTimestamp(playerEntity,block.timestamp);

    }
    function Explore() public{
        bytes32 playerEntity = LibGame.addressToEntityKey(address(_msgSender()));
        bool ret = PlayerComponent.get(playerEntity);
        require(ret,"player not init!");

        PlayerState state = PlayerInfoComponent.getState(playerEntity);
        require(state == PlayerState.Rest,"player state error!");

        PlayerInfoComponent.setState(playerEntity,PlayerState.Exploring);
        // PlayerInfoComponent.setExploreBlock(playerEntity,block.number+20);
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
