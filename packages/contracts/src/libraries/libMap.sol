// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
 
import { PlayerComponentTableId } from "../codegen/Tables.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { Perlin } from "@latticexyz/noise/contracts/Perlin.sol";
library LibMap {

  function distance(int32 fromX,int32 fromY,int32 toX,int32 toY) internal pure returns (int32) {
    int32 deltaX = fromX > toX ? fromX - toX : toX - fromY;
    int32 deltaY = fromY > toY ? fromY - toY: toY - fromY;
    return deltaX + deltaY;
  }
  function getMapPerlin(int32 x,int32 y)internal view returns (uint256){
        Perlin.noise(x,y,0,12,1);
        
  }
 
  
}