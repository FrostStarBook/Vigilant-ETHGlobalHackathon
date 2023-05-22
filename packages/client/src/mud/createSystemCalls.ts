import { Has, HasValue, getComponentValue, runQuery } from "@latticexyz/recs";
import { awaitStreamValue, random, uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { errors } from "ethers";
 
export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { playerEntity, worldSend, txReduced$, singletonEntity }: SetupNetworkResult,
  { 
    PlayerComponent,
    MapComponent,
    ObstructionComponent,
    PositionComponent }: ClientComponents
) {
  
  const isObstructed = (x: number, y: number) => {
    return runQuery([Has(ObstructionComponent), HasValue(PositionComponent, { x, y })]).size > 0;
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
      
    try {
      const tx = await worldSend("JoinGame", [randX, randY]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
    } finally {
       
    }
  };
  const moveTo = async (toX:number,toY:number) => {
    if (!playerEntity) {
      console.log('player error ');
      return false;
    }

    try {
      const tx = await worldSend("Move", [toX, toY]);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return true;
    } catch {
        return false;
    }
  };
  const explore = async () => {
    if (!playerEntity) {
      console.log('player error ');
      return false;
    }

    try {
      const tx = await worldSend("Explore", []);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return true;
    } catch {
        return false;
    }
  };
  const gain = async () => {
    if (!playerEntity) {
      console.log('player error ');
      return false;
    }

    try {
      const tx = await worldSend("Gain", []);
      await awaitStreamValue(txReduced$, (txHash) => txHash === tx.hash);
      return true;
    } catch {
        return false;
    }
  };
  return {
    joinGame,
    isObstructed,
    moveTo,
    explore,
    gain
  };
}
