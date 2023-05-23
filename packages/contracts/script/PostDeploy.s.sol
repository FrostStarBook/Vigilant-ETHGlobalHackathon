// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";
import { MapComponent } from "../src/codegen/Tables.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // ------------------ EXAMPLES ------------------



    IWorld world = IWorld(worldAddress);
    console.log("world address:", worldAddress);

    int256 blockSize = 64;
    int256 width = 100;
    int256 height = 100;
    int256 seed = 1009;
    int256 denom = 1024;
    uint256 precision = 64;
    uint256 stepLimit = 4;
    uint256 energyMax = 200;
    uint256 moveCost = 1;
    uint64 exploreBlockLimit = 1;
    uint64 restoreEnergy = 10;


    MapComponent.set(world,blockSize,width,height,seed,denom,stepLimit,energyMax,moveCost,exploreBlockLimit,restoreEnergy);
    uint256 moveCost = 10;
    uint256 exploreTime = 20;
    uint256 restoreEnergy = 10;


    MapComponent.set(world,width,height,seed, denom,precision,stepLimit,energyMax,moveCost,exploreTime,restoreEnergy);

    vm.stopBroadcast();
  }
}
