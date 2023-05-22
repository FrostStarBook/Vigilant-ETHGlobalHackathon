import { mudConfig } from "@latticexyz/world/register";
import { resolveTableId } from "@latticexyz/config";

export default mudConfig({
  tables: {
    Counter: {
      keySchema: {},
      schema: "uint32",
    },
    ObstructionComponent:"bool",
    PlayerComponent: "bool",
    PositionComponent: {
      schema: { x: "uint256", y: "uint256" },
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
