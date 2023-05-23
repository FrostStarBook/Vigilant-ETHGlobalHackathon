import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
  enums: {
    PlayerState: ["Exploring", "Rest"],
  },
  tables: {
    TestComponent:"int128",
    ObstructionComponent:"bool",
    NFTComponent: {
      dataStruct: false,
      schema: { 
        hp:'int64',
        atk:"int64",
        def:"int64",
        mp:"int64",
        dama:"int64",
        spd:"int64",
        },
    },
    
    PlayerComponent: "bool",
    PositionComponent: {
      dataStruct: false,
      schema: {
        x: "int256",
        y: "int256",
      },
    },
    PlayerInfoComponent: {
      dataStruct: false,
      schema: { 
        exploreBlock:'uint64',
        updateTimestamp:"uint256",
        state:"PlayerState",
        energy:"uint256",
        },
    },
    MapComponent: {
      keySchema: {},
      dataStruct: false,
      schema: { 
        blockSize:'int256',
        width: "int256", 
        height: "int256",
        seed:"int256",
        denom:"int256",
        stepLimit:'uint256',
        energyMax:"uint256",
        moveCost:"uint256",
        exploreBlockLimit:"uint64",
        restoreEnergy:"uint64",
       },
    },
  },
  modules: [
    {
      name: "KeysInTableModule",
      root: true,
      args: [resolveTableId("PlayerComponent")],
    },
    {
      name: "KeysWithValueModule",
      root: true,
      args: [resolveTableId("PositionComponent")],
    },
  ],
});
