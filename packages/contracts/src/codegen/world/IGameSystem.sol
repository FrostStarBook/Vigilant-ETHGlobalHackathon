// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

interface IGameSystem {
  function JoinGame(int256 x, int256 y) external;

  function Move(int256 x, int256 y) external;

  function Rest() external;

  function Explore() external;
}
