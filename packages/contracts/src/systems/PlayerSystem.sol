// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { System } from "@latticexyz/world/src/System.sol";
import { PlayerComponent,PositionComponent,ObstructionComponent } from "../codegen/Tables.sol";
import { LibGame } from "../libraries/libGame.sol";

contract PlayerSystem is System {
    function joinGame(uint256 x, uint256 y) public returns (uint32) {
        bytes32 playerEntity = LibGame.addressToEntityKey(address(_msgSender()));
        bool ret = PlayerComponent.get(playerEntity);
        require(!ret,"already join game!");


        bytes32 position = LibGame.positionToEntityKey(x, y);
        require(!ObstructionComponent.get(position), "this space is obstructed");


        PlayerComponent.set(playerEntity,true);
        PositionComponent.set(playerEntity,x,y);
        ObstructionComponent.set(position,true);
        // PositionComponent.set(playerEntity,x,y);
    }
}
