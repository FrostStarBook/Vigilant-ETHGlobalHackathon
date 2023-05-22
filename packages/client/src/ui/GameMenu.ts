import { PlayerActionEvent } from "../common/world";

const { regClass, property } = Laya;

@regClass()
export class Menu extends Laya.Script {
    //declare owner : Laya.Sprite3D;

    @property( { type: Laya.Text } )
    private move_menu: Laya.Text;
    @property( { type: Laya.Text } )
    private explore_menu: Laya.Text;
    @property( { type: Laya.Text } )
    private gain_menu: Laya.Text;
    @property( { type: Laya.Image } )
    private menu: Laya.Image;
    constructor() {
        super();
    }
    onAwake(): void {
         
        this.move_menu.on(Laya.Event.CLICK, this, this.onMoveMenuClick);
        this.explore_menu.on(Laya.Event.CLICK, this, this.onExploreMenuClick);
        this.gain_menu.on(Laya.Event.CLICK, this, this.onGainMenuClick);
    }
    
    onMoveMenuClick(e: Laya.Event): void {
       Laya.stage.event(PlayerActionEvent.Move);
       this.menu.visible = false;
    }
    onExploreMenuClick(e: Laya.Event): void {
        Laya.stage.event(PlayerActionEvent.Explore);
        this.menu.visible = false;
    }
    onGainMenuClick(e: Laya.Event): void {
        Laya.stage.event(PlayerActionEvent.Gain);
        this.menu.visible = false;
    }
}