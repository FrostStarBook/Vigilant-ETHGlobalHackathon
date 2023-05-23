// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { PlayerComponent,PlayerInfoComponent,ObstructionComponent,PositionComponent } from "../codegen/Tables.sol";
import { LibGame } from "../libraries/libGame.sol";
import { PlayerStatus } from "../codegen/Types.sol";


contract GameSystem is System {
    function JoinGame(int256 x, int256 y) public {
        bytes32 playerEntity = LibGame.addressToEntityKey(address(_msgSender()));
        bool ret = PlayerComponent.get(playerEntity);
        require(!ret,"already join game!");


        bytes32 position = LibGame.positionToEntityKey(x, y);
        require(!ObstructionComponent.get(position), "this space is obstructed");

        PlayerComponent.set(playerEntity,true);
        int32 energy = 200;
        uint256 timestamp = block.timestamp;
        PlayerInfoComponent.set(playerEntity,timestamp,PlayerStatus.Rest,energy);
        PositionComponent.set(playerEntity,x,y);
        ObstructionComponent.set(position,true);

    }
    function Move(int256 x, int256 y) public{

    }
    function Rest() public{
        bytes32 playerEntity = LibGame.addressToEntityKey(address(_msgSender()));
        bool ret = PlayerComponent.get(playerEntity);
        require(ret,"player not init!");


    }
    function Explore() public{

    }
}
