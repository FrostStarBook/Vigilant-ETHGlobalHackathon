import { GameBase } from "./Game.generated";
import { HeroDir, MoveLenthLimit, Rectangle, TerrianType } from "../common/world";
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

    onMouseClick(e: Laya.Event): void {
        const x = Laya.stage.mouseX;
        const y = Laya.stage.mouseY;
        
        let movePoint = new Laya.Point(x, y);
        this.bg.globalToLocal(movePoint, false);
        
        movePoint.x = Math.floor(movePoint.x / this.chunkSideLength) * this.chunkSideLength;
        movePoint.y = Math.floor(movePoint.y / this.chunkSideLength) * this.chunkSideLength;
        
        console.log(Math.abs(this.char.x - movePoint.x));
        console.log(Math.abs(this.char.y - movePoint.y));

        if(Math.abs(this.char.x - movePoint.x) / 64 + Math.abs(this.char.y - movePoint.y) / 64 > MoveLenthLimit) {
            return;
        }

        const spx = Math.abs(movePoint.x - this.char.x) / this.speed;
        
        console.log(spx);

        let script = this.char.getComponent(Laya.Script) as hero;
    
        if(this.char.x > movePoint.x){
            script.SetDir(HeroDir.Left);
        }else{
            script.SetDir(HeroDir.Right);
        }

        Laya.Tween.to(this.char, {x : movePoint.x}, spx * 1000, Laya.Ease.linearIn, 
            Laya.Handler.create(this, this.onMoveXFinishEvent.bind(this), [movePoint.y]));
    }

    onMoveXFinishEvent(args:number){
        const y = args;
        let script = this.char.getComponent(Laya.Script) as hero;
    
        if(this.char.y > y) {
            script.SetDir(HeroDir.Up);
        } else {
            script.SetDir(HeroDir.Down);
        }
        const spy = Math.abs(y - this.char.y) / this.speed;
        Laya.Tween.to(this.char, {y:y}, spy * 1000, Laya.Ease.linearIn, Laya.Handler.create(this, this.onMoveYFinishEvent.bind(this)));
    }

    onMoveYFinishEvent(args:number){
        let script = this.char.getComponent(Laya.Script) as hero;
        script.SetDir(HeroDir.Stand);
    }
}