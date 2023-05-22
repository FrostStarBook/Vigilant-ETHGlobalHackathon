/* Autogenerated file. Do not edit manually. */

import { TableId } from "@latticexyz/utils";
import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    ObstructionComponent: (() => {
      const tableId = new TableId("", "ObstructionCompo");
      return defineComponent(
        world,
        {
          value: RecsType.Boolean,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    PlayerComponent: (() => {
      const tableId = new TableId("", "PlayerComponent");
      return defineComponent(
        world,
        {
          value: RecsType.Boolean,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    PositionComponent: (() => {
      const tableId = new TableId("", "PositionComponen");
      return defineComponent(
        world,
        {
          x: RecsType.BigInt,
          y: RecsType.BigInt,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    PlayerInfoComponent: (() => {
      const tableId = new TableId("", "PlayerInfoCompon");
      return defineComponent(
        world,
        {
          updateTimestamp: RecsType.BigInt,
          state: RecsType.Number,
          energy: RecsType.BigInt,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
    MapComponent: (() => {
      const tableId = new TableId("", "MapComponent");
      return defineComponent(
        world,
        {
          width: RecsType.BigInt,
          height: RecsType.BigInt,
          seed: RecsType.BigInt,
          denom: RecsType.BigInt,
          precision: RecsType.BigInt,
          stepLimit: RecsType.BigInt,
          energyMax: RecsType.BigInt,
          moveCost: RecsType.BigInt,
          exploreTime: RecsType.BigInt,
          restoreEnergy: RecsType.BigInt,
        },
        {
          metadata: {
            contractId: tableId.toHexString(),
            tableId: tableId.toString(),
          },
        }
      );
    })(),
  };
}
