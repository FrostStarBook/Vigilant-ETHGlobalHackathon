import { BLOCK_SIZE, HeroDir, PlayerActionEvent, Rectangle, TerrianType } from "../common/world";
import {perlin} from '../common/perlin';
import { GameConfigType, defaultGameConfig,PlayerInfoType, PlayerStateType, PlayerPositionType } from "../common/config";
import { setup } from "../mud/setup";
import { defineSystem, Has, getComponentValueStrict,getComponentValue,runQuery,UpdateType } from "@latticexyz/recs";

const { regClass, property } = Laya;

@regClass()
export class Game extends Laya.Script {
    //declare owner : Laya.Sprite3D;
 
    @property( { type: Laya.Image } )
    private bg: Laya.Image;
    @property( { type: Laya.Text  } )
    private energy: Laya.Text;

    @property( { type: Laya.Image  } )
    private loading: Laya.Image;
 
    playerImageMap:Map<string,Laya.Image> = new Map();
  
    fromChunk: Rectangle;
    nextChunk:Rectangle;
    bgRes:Laya.Texture;
    speed:number = 500;
    mud:any;
 
    updateTimestamp:number;
    initFlag:boolean = true;
    onAwake() {
        this.updateTimestamp = Date.now();
        this.loading.width = Laya.Browser.width;
        this.loading.height = Laya.Browser.height;
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(PlayerActionEvent.CheckMove, this, this.onCheckMoveEvent);
        Laya.stage.on(PlayerActionEvent.Explore, this, this.onExploreEvent);
        Laya.stage.on(PlayerActionEvent.Gain, this, this.onGainEvent);
        setup().then( async (result)=>{
            this.mud = result;
        const {
            network: { playerEntityId,world },
          }  = this.mud;
          console.log(this.mud);
         console.log('playerEntity  ',playerEntityId);
  
          
        this.mud.components.MapComponent.update$.subscribe((update) => {
            this.updateTimestamp = Date.now();
            const [nextValue, prevValue] = update.value;
        
            this.updateMap();
          });
          

        this.mud.components.PositionComponent.update$.subscribe((update) => {
            this.updateTimestamp = Date.now();
            const [nextValue, prevValue] = update.value;
            console.log('PositionComponent--- ',update)

            const entity = world.registerEntity({ id: update.entity });
            this.updatePlayerPos(entity);
            
          });
        this.mud.components.PlayerInfoComponent.update$.subscribe((update) => {
            this.updateTimestamp = Date.now();
            const [nextValue, prevValue] = update.value;
            console.log('PlayerInfoComponent--- ',update);
 
            const entity = world.registerEntity({ id: update.entity });
            this.updatePlayerInfo(entity);
          
          });
      } );
      // this.mud = await setup();
         
    }
    onUpdate(): void {
        const curNow = Date.now();
        if(curNow - this.updateTimestamp > 5*1000 && this.initFlag){
            const {
                components:{MapComponent},
                network: { singletonEntity },
              }  = this.mud;
            const mapConfig = getComponentValue(MapComponent, singletonEntity);
            if(mapConfig == undefined){
                this.updateTimestamp = curNow;
                return;
            }
            this.loading.visible = false;
            this.initFlag = false;
            this.checkPlayerInit();
        }
    }
   
    updateMap(){
        const {
            components:{MapComponent},
            network: { singletonEntity },
          }  = this.mud;
        const mapConfig = getComponentValue(MapComponent, singletonEntity);

        const {width,height} = mapConfig;
        
        const WidthBlock = Number(width);
        const HeightBlock = Number(height);
        const WorldWidth = WidthBlock*BLOCK_SIZE;
        const WorldHeight = HeightBlock*BLOCK_SIZE;

        const bottomLeftX =WorldWidth/2-BLOCK_SIZE;
        const bottomLeftY = WorldHeight/2-BLOCK_SIZE;
        const bottomLeft = { x: bottomLeftX, y: bottomLeftY };

        this.fromChunk = {
            bottomLeft,
            sideLength: BLOCK_SIZE,
            };
        this.nextChunk = this.fromChunk;
  
       
        this.bg.width = WorldWidth;
        this.bg.height = WorldHeight;
        this.bg.anchorX = 0.5;
        this.bg.anchorY = 0.5;
        const total = WidthBlock*HeightBlock;
        for (let index = 0; index < total; index++) {
            this.CreateMap(BLOCK_SIZE);
        }
        //Laya.timer.once(5000,this, this.checkPlayerInit);
        //this.checkPlayerInit();
    }
    checkPlayerInit(){
        const {
            systemCalls: { joinGame },
          }  = this.mud;
 
          joinGame(); 
    }
   
    initPlayer(entity:string){
        Laya.loader.load("resources/prefab/P_charator.lh").then( (res)=>{
            const {
                components:{PlayerInfoComponent,PositionComponent,MapComponent},
                network: { playerEntity,singletonEntity },
              }  = this.mud;
            const mapConfig = getComponentValue(MapComponent, singletonEntity);
    
            const {width,height,stepLimit} = mapConfig;
            const WorldWidth = Number(width)*BLOCK_SIZE;
            const WorldHeight = Number(height)*BLOCK_SIZE;
            const StepLimit = Number(stepLimit);
            //创建预制体 

            const playerPos = getComponentValue(PositionComponent,entity);
            const state =  getComponentValue(PlayerInfoComponent,entity).state as PlayerStateType;
            const x = Number(playerPos.x)*BLOCK_SIZE;
            const y = Number(playerPos.y)*BLOCK_SIZE;
            let player = res.create();
            player.pos(x,y);
            this.bg.addChild(player);
        } );
    }

    updatePlayerPos(entity:string){
        const {
            components:{PlayerInfoComponent}
        }  = this.mud;
        if(!this.playerImageMap.has(entity)){
            const playerInfo = getComponentValue(PlayerInfoComponent,entity);
            if(playerInfo){
                this.initPlayer(entity);
            }
        }else{
            this.onMoveAction(entity);
        }
    }
    updatePlayerInfo(entity:string){

        const {
            network: {playerEntity },
            components:{PositionComponent,PlayerInfoComponent}
          }  = this.mud;
        const playerInfo = getComponentValue(PlayerInfoComponent,entity);
        if(entity== playerEntity){
            this.energy.text = playerInfo.energy.toString();
        }
         
        if(!this.playerImageMap.has(entity)){
            const posInfo = getComponentValue(PositionComponent,entity);
            if(posInfo){
                this.initPlayer(entity);
           }
        }else{
            let script = this.playerImageMap.get(entity).getComponents(Laya.Script)[1] as Hero;
            script.SetState(playerInfo.state as PlayerStateType);
        }
        
 
    }
    onStart(): void {
        console.log('-----');
    }
    onMoveAction(entity:string){
        console.log('onMoveAction---  ');
        const {
            components:{PositionComponent},
            network: { singletonEntity },
          }  = this.mud;
 
        const nextPos = getComponentValue(PositionComponent,entity);
        const x = Number(nextPos.x);
        const y = Number(nextPos.y);
        let movePoint = new Laya.Point(x,y);
        movePoint.x *= BLOCK_SIZE;
        movePoint.y *= BLOCK_SIZE;
        console.log('onMoveAction  ',movePoint.x,movePoint.y);

        const player = this.playerImageMap.get(entity);
        if(player){
            let script = player.getComponents(Laya.Script)[1] as Hero;
            script.SetBgVisible(false);
            const spx = Math.abs(movePoint.x-player.x)/this.speed;
         
            if(player.x > movePoint.x){
                script.SetDir(HeroDir.Left);
            }else{
                script.SetDir(HeroDir.Right);
            }
            Laya.Tween.to(player,{x:movePoint.x},spx*1000,Laya.Ease.linearIn,Laya.Handler.create(this,this.onMoveXFinishEvent.bind(this),[entity,movePoint.y]));
            
        }
    }
    async onGainEvent(){

    }
    async onExploreEvent(){
        console.log('----onExploreEvent ');
             const {
            systemCalls: { explore },
          }  = this.mud;
        this.popLoading(true);
        const result = await explore();
         this.popLoading(false);
        console.log('---result',result);
    }
    async onCheckMoveEvent(entity:string) {
        if(!this.playerImageMap.has(entity)){
            return;
        };
        const player = this.playerImageMap.get(entity);
        let script = player.getComponents(Laya.Script)[1] as Hero;
        script.SetBgVisible(false);
        const {
            components:{MapComponent},
            network: { singletonEntity },
          }  = this.mud;
        const mapConfig = getComponentValue(MapComponent, singletonEntity);

        const { moveCost, stepLimit} = mapConfig;
         
        const StepLimit = Number(stepLimit);
        const MoveCost = Number(moveCost);
        const x = Laya.stage.mouseX;
        const y = Laya.stage.mouseY;
        let movePoint = new Laya.Point(x,y);
        this.bg.globalToLocal(movePoint,false);
         
        movePoint.x = Math.floor(movePoint.x/BLOCK_SIZE)*BLOCK_SIZE;
        movePoint.y = Math.floor(movePoint.y/BLOCK_SIZE)*BLOCK_SIZE;

         

        
        const dis = Math.abs(player.x-movePoint.x)/BLOCK_SIZE + Math.abs(player.y-movePoint.y)/BLOCK_SIZE;
        if(dis > StepLimit){
            this.popMessage("step limit");
           
            return;
        }
        const {
            systemCalls: { isObstructed,moveTo },
            components:{PlayerInfoComponent},
            network: {playerEntityId },
          }  = this.mud;
        if(isObstructed(movePoint.x,movePoint.y)){
            this.popMessage("this space is obstructed");
            return;
        }
        const playerInfo = getComponentValue(PlayerInfoComponent,playerEntityId);
        if(playerInfo == undefined){
            return;
        }
        if(playerInfo.state  as PlayerStateType != PlayerStateType.Rest){
            this.popMessage("state error");
            return;
        }
        if(dis*MoveCost > playerInfo.energy){
            this.popMessage("energy lower");
            return;
        }
         
        this.popLoading(true);
        const result = await moveTo(movePoint.x/BLOCK_SIZE,movePoint.y/BLOCK_SIZE);
        console.log('---result',result);
        this.popLoading(false);
  
        /*
        const spx = Math.abs(movePoint.x-player.x)/this.speed;
         
        if(player.x > movePoint.x){
            script.SetDir(HeroDir.Left);
        }else{
            script.SetDir(HeroDir.Right);
        }
        Laya.Tween.to(player,{x:movePoint.x},spx*1000,Laya.Ease.linearIn,Laya.Handler.create(this,this.onMoveXFinishEvent.bind(this),[entityId,movePoint.y]));
        */
    }
    onMoveXFinishEvent(entityId:string,args:number){
        if(!this.playerImageMap.has(entityId)){
            return;
        };
        const player = this.playerImageMap.get(entityId);
        const y = args;
        let script = player.getComponents(Laya.Script)[1] as Hero;
    
        if(player.y > y){
            script.SetDir(HeroDir.Up);
        }else{
            script.SetDir(HeroDir.Down);
        }
        const spy = Math.abs(y-player.y)/this.speed;
        Laya.Tween.to(player,{y:y},spy*1000,Laya.Ease.linearIn,Laya.Handler.create(this,this.onMoveYFinishEvent.bind(this),[entityId]));
    }
    onMoveYFinishEvent(entityId:string){
        if(!this.playerImageMap.has(entityId)){
            return;
        };
        const player = this.playerImageMap.get(entityId);
        let script = player.getComponents(Laya.Script)[1] as Hero;
        script.SetDir(HeroDir.Stand);
    }
    mouseDown(e: Laya.Event): void {
        this.bg.startDrag();
 
    }
    CreateMap(BlockSize:number){
        const p = perlin(this.nextChunk.bottomLeft.x,this.nextChunk.bottomLeft.y,7240, 1024)*10;
        let terrianType = this.terrianTypeFromPerlin(p);
    }
    public terrianTypeFromPerlin(perlin: number): TerrianType {
        if (perlin < TerrianType.Water) {
            return TerrianType.Water;
        } else if (perlin < TerrianType.Glass) {
            return TerrianType.Glass;
        } else if (perlin < TerrianType.Soil) {
            return TerrianType.Soil;
        }else if (perlin < TerrianType.Fire) {
            return TerrianType.Fire;
        }else if (perlin < TerrianType.Ice) {
            return TerrianType.Ice;
        }else {
            return TerrianType.Water;
        }
  }
    popMessage(message:string){
        Laya.Scene.open("resources/prefab/P_Message.lh", false, {"text":message}); 
    }
    popLoading(open:boolean){
        if(open){
            Laya.Scene.open("resources/prefab/P_Loading.lh", false); 
        }
         else{
             Laya.Scene.close("resources/prefab/P_Loading.lh"); 
         }
    }
     
 
}