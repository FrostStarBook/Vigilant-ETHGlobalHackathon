 export interface GameConfigType {
   
    WidthBlock: number;
    
    HeightBlock: number;
 
    BlockSize: number;

    WorldWidth:number;

    WorldHeight:number;
 
    Seed: number;
 
    Denom: number;
 
    Precision: number;
 
    StepLimit: number;

    EnergyMax:number;

    MoveCost:number;

    ExploreTime:number;

    RestoreEnergy:number;
};

export enum PlayerStateType{
    Exploring,
    Rest
}

export interface PlayerPositionType {
    id:string;

    x: number;
 
    y: number;
};
 
export interface PlayerInfoType {
   
    state:PlayerStateType;

    energy:number;

    updateTimestamp:number;
};
 
export const defaultGameConfig: GameConfigType = {
      
    WidthBlock: 100,

    HeightBlock: 100,

    BlockSize:64,

    WorldWidth: 6400,
 
    WorldHeight: 6400,

    Seed: 1009,

    Denom: 1024,

    Precision:10,

    StepLimit:4,

    EnergyMax:200,

    MoveCost:10,

    ExploreTime:6*60*60,

    RestoreEnergy:10,
};
  