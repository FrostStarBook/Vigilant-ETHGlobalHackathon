export type WorldCoords = {
    x: number;
    y: number;
  };

export interface Rectangle {
    bottomLeft: WorldCoords;
    sideLength: number;
}

export enum TerrianType{
    Grass = 3,
    Forest,
    Mountain,
    Desert,
    Icefield,
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

  