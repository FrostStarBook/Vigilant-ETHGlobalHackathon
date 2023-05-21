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

};

export enum PlayerStateType{
    Move = 0,
    Explore,
    Rest
}

export interface PlayerPositionType {
    
    x: number;
 
    y: number;
};
 
export interface PlayerInfoType {
   
    pos: PlayerPositionType;
 
    state:number;

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
 
};
