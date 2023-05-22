import { PlayerStateType } from "../common/config";
import { HeroDir,PlayerActionEvent } from "../common/world";

const { regClass, property } = Laya;

@regClass()
export class Hero extends Laya.Script {
    //declare owner : Laya.Sprite3D;
    @property( { type: Laya.Animation } )
    private move_up: Laya.Animation;
    @property( { type: Laya.Animation } )
    private move_down: Laya.Animation;
    @property( { type: Laya.Animation } )
    private move_right: Laya.Animation;
    @property( { type: Laya.Animation } )
    private move_left: Laya.Animation;
    @property( { type: Laya.Image } )
    private bg: Laya.Image;
    @property( { type: Laya.Image } )
    private stand: Laya.Image;
    @property( { type: Laya.Image } )
    private menu: Laya.Image;
    @property( { type: Laya.Image } )
    private state: Laya.Image;
     
    public stepLimit:number = 4;
    public touchFlag:boolean = false;
    public Entity:string;
    onAwake(): void {
        this.bg.width = Laya.Browser.width;
        this.bg.height = Laya.Browser.height;
    }
}