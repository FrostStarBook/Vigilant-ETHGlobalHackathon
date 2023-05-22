export type WorldCoords = {
    x: number;
    y: number;
  };

export interface Rectangle {
    bottomLeft: WorldCoords;
    sideLength: number;
}

export enum TerrianType{
    Ice = 3,
    Water,
    Glass,
    Soil,
    Fire,
}

export enum HeroDir{
    Stand = 0,
    Up,
    Down,
    Right,
    Left,
}

export enum PlayerActionEvent{
    Move = 'Move',
    CheckMove = 'CheckMove',
    Explore = 'Explore',
    Gain = 'Gain',
}

export const BLOCK_SIZE = 64;

  