import { GameMessageBase } from "./GameMessage.generated";

const { regClass, property } = Laya;

@regClass()
export class GameMessage extends GameMessageBase {
 
    constructor() {
        super();
    }
    onAwake(): void {

        this.Label.text = "";
        
        
    }
    onOpened(param: any): void {
        console.log('onOpened  ',param.text);
        this.Label.text = param.text;
    }
    onDisable(): void {
    }

   
}