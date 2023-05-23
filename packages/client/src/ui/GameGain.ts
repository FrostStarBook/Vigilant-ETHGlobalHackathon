import { GameGainBase } from "./GameGain.generated";

const { regClass, property } = Laya;

@regClass()
export class GameGain extends GameGainBase {
    //declare owner : Laya.Sprite3D;

    constructor() {
        super();
    }
    onOpened(param: any): void {
        console.log('onOpened  ',param.attr);
        const url = "resources/vigalant/vigilant_"+param.attr+".png";
        Laya.loader.load(url).then(() => {
            this.icon.texture  = Laya.loader.getRes(url);
        });
    }
}