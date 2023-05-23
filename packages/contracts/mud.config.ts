import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
  enums: {
    PlayerState: ["Exploring", "Rest"],
  },
  tables: {
    ObstructionComponent:"bool",
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
        updateTimestamp:"uint256",
        state:"PlayerState",
        energy:"uint256",
      },
    },
    MapComponent: {
      keySchema: {},
      dataStruct: false,
      schema: {
        width: "int256",
        height: "int256",
        seed:"int256",
        denom:"int256",
        precision:"uint256",
        stepLimit:'uint256',
        energyMax:"uint256",
        moveCost:"uint256",
        exploreTime:"uint256",
        restoreEnergy:"uint256",
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
