import { GameBase } from "./Game.generated";
const { regClass, property } = Laya;

@regClass()
export class Game extends GameBase {
    //declare owner : Laya.Sprite3D;
    chunkSideLength: number = 64;     
    
    fromChunk: Rectangle;
    nextChunk:Rectangle;
    bgRes:Laya.Texture;
    speed:number = 500;
    onAwake() {
        console.log("Game start");
        const bottomLeftX = 0;
        const bottomLeftY = 0;
        const bottomLeft = { x: bottomLeftX, y: bottomLeftY };

        this.fromChunk = {
            bottomLeft,
            sideLength: this.chunkSideLength,
            };
        this.nextChunk = this.fromChunk;

        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
    }

    mouseDown(e: Laya.Event): void {
        this.bg.startDrag();
    }
}