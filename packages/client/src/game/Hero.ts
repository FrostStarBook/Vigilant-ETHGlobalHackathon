 
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
        for (let i = -this.stepLimit; i < this.stepLimit+1; i++) {
          for (let j = -this.stepLimit; j < this.stepLimit+1; j++) {
                if(Math.abs(i)+Math.abs(j) <= this.stepLimit){
                    this.bg.graphics.drawRect(64*i+this.bg.width/2-32,64*j+this.bg.height/2-32,64,64,'ae13d4','000000',0.5);
                }
          }
        }
        this.menu.visible = false;
        this.bg.visible = false;
        
        this.stand.on(Laya.Event.CLICK, this, this.onTouchPlayer);
        Laya.stage.on(PlayerActionEvent.Move, this, this.onMoveEvent);
        this.bg.on(Laya.Event.CLICK, this, this.onClickEvent);
        this.SetDir(HeroDir.Stand);
    }
    onClickEvent(e: Laya.Event): void {
        if(this.touchFlag == false){
            return;
        }
        console.log('onClickEvent');
        
        Laya.stage.event(PlayerActionEvent.CheckMove,this.Entity);
    }
    onTouchPlayer(e: Laya.Event): void {
        if(this.touchFlag == false){
            return;
        }
        console.log('onTouchChar');
        this.menu.visible = !this.menu.visible;
        if(this.bg.visible){
            this.bg.visible = false;
        }
    }
    onMoveEvent(){
        console.log('!!!');
        this.menu.visible = !this.menu.visible;
        this.bg.visible = !this.bg.visible;
      
    }
    SetState(playerState:PlayerStateType){
        if(playerState == PlayerStateType.Exploring){
            this.state.color = "FF0000";
        }else{
            this.state.color = "FFFFFF";
        }
         
    }
   
    SetBgVisible(visible:boolean){
        console.log('SetBgVisible');
        this.bg.visible = visible;
    }
    SetDir(dir:HeroDir){
        this.move_up.visible = false;
        this.move_down.visible = false;
        this.move_right.visible = false;
        this.move_left.visible = false;
        this.stand.visible = false;
        switch (dir) {
            case HeroDir.Stand:
                this.stand.visible = true;
                break;
            case HeroDir.Up:
                    this.move_up.visible = true;
                break;
                case HeroDir.Down:
                    this.move_down.visible = true;
                break;
                case HeroDir.Right:
                    this.move_right.visible = true;
                break;
                case HeroDir.Left:
                    this.move_left.visible = true;
                break;
            default:
                break;
        }
    }
}