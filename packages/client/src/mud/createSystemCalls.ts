import { Has, HasValue, getComponentValue, runQuery } from "@latticexyz/recs";
import { awaitStreamValue, random, uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
 
export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { playerEntity, worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { 
    PlayerComponent,
    MapComponent,
    ObstructionComponent,
    PlayerInfoComponent }: ClientComponents
) {
  
  const isObstructed = (x: number, y: number) => {
    return runQuery([Has(ObstructionComponent), HasValue(PlayerInfoComponent, { x, y })]).size > 0;
  };
 
  const joinGame = async () => {
    if (!playerEntity) {
      console.log('player error ');
      return;
    }
    const canJoinGame = getComponentValue(PlayerComponent, playerEntity)?.value !== true;
 
    if(!canJoinGame){
      console.log('player alread enter game ');
        return;
    }
   
    let randX:number = 0;
    let randY:number = 0;
    const mapConfig = getComponentValue(MapComponent, singletonEntity);
    const mapWidth = Number(mapConfig.width);
    const mapHeight = Number(mapConfig.height);
    while(true){
      randX = random(0,mapWidth);
      randY = random(0,mapHeight);
      if (!isObstructed(randX, randY)) {
          break;
      }
    }
     /*
    const infoId = uuid();
    PlayerInfoComponent.addOverride(infoId, {
      entity: playerEntity,
      value: { x:randX, y:randY },
    });
    const playerId = uuid();
    PlayerComponent.addOverride(playerId, {
      entity: playerEntity,
      value: { value: true },
    });
*/
    try {
      const tx = await worldSend("JoinGame", [randX, randY]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
     // PlayerInfoComponent.removeOverride(infoId);
    //  PlayerComponent.removeOverride(playerId);
    }
  };

  return {
    joinGame,
  };
}