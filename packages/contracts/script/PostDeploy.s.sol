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

    // Call increment on the world via the registered function selector
    uint32 newValue = IWorld(worldAddress).increment();
    console.log("Increment via IWorld:", newValue);

    IWorld world = IWorld(worldAddress);
    console.log("world address:", worldAddress);

    int256 width = 100;
    int256 height = 100;
    int256 seed = 1009;
    int256 denom = 1024;
    uint256 precision = 10;
    uint256 stepLimit = 4;

    MapComponent.set(world,width,height,seed, denom,precision,stepLimit);

    vm.stopBroadcast();
  }
}
