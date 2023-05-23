// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { PlayerComponentTableId } from "../codegen/Tables.sol";
import { query, QueryFragment, QueryType } from "@latticexyz/world/src/modules/keysintable/query.sol";
import { Perlin } from "@latticexyz/noise/contracts/Perlin.sol";
library LibMap {

  function distance(int256 fromX,int256 fromY,int256 toX,int256 toY) internal pure returns (int256) {
    int256 deltaX = fromX > toX ? fromX - toX : toX - fromX;
    int256 deltaY = fromY > toY ? fromY - toY: toY - fromY;
    return deltaX + deltaY;
  }
  function getPerlin(int256 x,int256 y,int256 seed,int256 denom , uint8 precision)public returns (int128){
    return Perlin.noise(x,y,seed,denom,precision);
  }


}