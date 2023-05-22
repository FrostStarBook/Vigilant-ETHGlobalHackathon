import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
  enums: {
    PlayerStatus: ["Move", "Explore", "Rest"],
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
      schema: { 
        updateTimestamp:"uint256",
        state:"PlayerStatus",
        energy:"int32",
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
