import { HeroDir, PlayerActionEvent, Rectangle, TerrianType } from "../common/world";
import {perlin} from '../common/perlin'; 
import { Hero } from "./Hero";
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
       // this.loading.width = Laya.Browser.width;
       // this.loading.height = Laya.Browser.height;
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.mouseDown);
        Laya.stage.on(PlayerActionEvent.CheckMove, this, this.onCheckMoveEvent);
        Laya.stage.on(PlayerActionEvent.Explore, this, this.onExploreEvent);
        Laya.stage.on(PlayerActionEvent.Gain, this, this.onGainEvent);
        setup().then( async (result)=>{
            this.mud = result;
        const {
            network: { playerEntityId,world,playerEntity },
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
           this.mud.components.NFTComponent.update$.subscribe((update) => {
            this.updateTimestamp = Date.now();
            const [nextValue, prevValue] = update.value;
            console.log('NFTComponent--- ',update);
            const entity = world.registerEntity({ id: update.entity });
            if(playerEntity == entity && prevValue){
                if(nextValue.hp > prevValue.hp){
                    this.popGain('hp');
                }else if(nextValue.dama > prevValue.dama){
                    this.popGain('damap');
                }else if(nextValue.def > prevValue.def){
                    this.popGain('def');
                }else if(nextValue.atk > prevValue.atk){
                    this.popGain('atk');
                }else if(nextValue.spd > prevValue.spd){
                    this.popGain('spd');
                }else if(nextValue.mp > prevValue.mp){
                    this.popGain('mp');
                }
              
            }
           
          });
          this.mud.components.TestComponent.update$.subscribe((update) => {
            this.updateTimestamp = Date.now();
            const [nextValue, prevValue] = update.value;
            console.log('TestComponent--- ',update);
 
           
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

        const {width,height,seed,denom,blockSize} = mapConfig;
        const BlockSize = Number(blockSize);
        const WidthBlock = Number(width);
        const HeightBlock = Number(height);
         
        const Seed = Number(seed);
        const Denom = Number(denom);
        const WorldWidth = WidthBlock*BlockSize;
        const WorldHeight = HeightBlock*BlockSize;

        const bottomLeftX =WorldWidth/2-BlockSize;
        const bottomLeftY = WorldHeight/2-BlockSize;
        const bottomLeft = { x: bottomLeftX, y: bottomLeftY };

        this.fromChunk = {
            bottomLeft,
            sideLength: BlockSize,
            };
        this.nextChunk = this.fromChunk;
  
       
        this.bg.width = WorldWidth;
        this.bg.height = WorldHeight;
        this.bg.anchorX = 0.5;
        this.bg.anchorY = 0.5;
        const total = WidthBlock*HeightBlock;
        for (let index = 0; index < total; index++) {
            this.CreateMap(BlockSize,Seed,Denom);
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
    
            const {width,height,stepLimit,blockSize} = mapConfig;
            const BlockSize = Number(blockSize);
            const WorldWidth = Number(width)*BlockSize;
            const WorldHeight = Number(height)*BlockSize;
            const StepLimit = Number(stepLimit);
            //创建预制体 

            const playerPos = getComponentValue(PositionComponent,entity);
            const state =  getComponentValue(PlayerInfoComponent,entity).state as PlayerStateType;
            const x = Number(playerPos.x)*BlockSize;
            const y = Number(playerPos.y)*BlockSize;
            let player = res.create();
            player.pos(x,y);
            this.bg.addChild(player);
  
            let script = player.getComponents(Laya.Script)[1] as Hero;
            if(entity == playerEntity){
                script.touchFlag = true;
                const deltaX = WorldWidth/2-x;
                const deltaY = WorldHeight/2-y;
                console.log(x,y);
                console.log(deltaX+Laya.Browser.width/2,deltaY+Laya.Browser.height/2);
                 

                this.bg.pos(deltaX+Laya.Browser.width/2,deltaY+Laya.Browser.height/2);
            }
            script.SetState(state);
            script.Entity = entity;
            script.stepLimit = StepLimit;
            this.playerImageMap.set(entity,player);
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
            components:{PositionComponent,MapComponent,},
            network: { singletonEntity },
          }  = this.mud;
 
        const nextPos = getComponentValue(PositionComponent,entity);
        const mapInfo = getComponentValue(MapComponent,singletonEntity);
        const BlockSize = Number(mapInfo.blockSize);
        const x = Number(nextPos.x);
        const y = Number(nextPos.y);
        let movePoint = new Laya.Point(x,y);
        movePoint.x *= BlockSize;
        movePoint.y *= BlockSize;
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
        console.log('----onGainEvent ');
             const {
            systemCalls: { gain },
            components:{PositionComponent,MapComponent},
            network: { playerEntity,singletonEntity },
          }  = this.mud;
          const posInfo = getComponentValue(PositionComponent,playerEntity);
          const mapInfo = getComponentValue(MapComponent,singletonEntity);
          const BlockSize = Number(mapInfo.blockSize);
          let p = perlin(Number(posInfo.x)*BlockSize,Number(posInfo.y)*BlockSize,Number(mapInfo.seed), Number(mapInfo.denom));
        
          console.log('onGainEvent   p  ',p);
        this.popLoading(true);
        const result = await gain();
        this.popLoading(false);
        console.log('---result',result);
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
            components:{PlayerInfoComponent,MapComponent},
            network: { playerEntity,singletonEntity },
            systemCalls: { isObstructed,moveTo },
          }  = this.mud;
        const mapConfig = getComponentValue(MapComponent, singletonEntity);

        const { moveCost, stepLimit,blockSize} = mapConfig;
        const BlockSize = Number(blockSize);
        const StepLimit = Number(stepLimit);
        const MoveCost = Number(moveCost);
        const x = Laya.stage.mouseX;
        const y = Laya.stage.mouseY;
        let movePoint = new Laya.Point(x,y);
        this.bg.globalToLocal(movePoint,false);
         
        movePoint.x = Math.floor(movePoint.x/BlockSize)*BlockSize;
        movePoint.y = Math.floor(movePoint.y/BlockSize)*BlockSize;

         

        
        const dis = Math.abs(player.x-movePoint.x)/BlockSize + Math.abs(player.y-movePoint.y)/BlockSize;
        if(dis > StepLimit){
            this.popMessage("step limit");
           
            return;
        }
 
        if(isObstructed(movePoint.x,movePoint.y)){
            this.popMessage("this space is obstructed");
            return;
        }
        const playerInfo = getComponentValue(PlayerInfoComponent,playerEntity);
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
        const result = await moveTo(movePoint.x/BlockSize,movePoint.y/BlockSize);
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
    CreateMap(blockSize:number,seed:number,denom:number){

        const p = perlin(this.nextChunk.bottomLeft.x,this.nextChunk.bottomLeft.y,seed,denom)*10;
        let terrianType = this.terrianTypeFromPerlin(p);
       
        this.bg.graphics.drawRect(this.nextChunk.bottomLeft.x,this.nextChunk.bottomLeft.y,blockSize,blockSize,this.terrianColorFromType(terrianType),'000000',0);
       // this.bg.graphics.drawImage(texture,this.nextChunk.bottomLeft.x+980/2,540/2-this.nextChunk.bottomLeft.y,16,16,this.terrianColorFromType(terrianType));
 
        this.nextChunk =  this.findNextChunk(this.nextChunk,blockSize);
    }
    isValidExploreTarget(chunkLocation: Rectangle): boolean {
        const { bottomLeft, sideLength } = chunkLocation;
        const xCenter = bottomLeft.x + sideLength / 2;
        const yCenter = bottomLeft.y  + sideLength / 2;
        const xMinAbs = Math.abs(xCenter) - sideLength / 2;
        const yMinAbs = Math.abs(yCenter) - sideLength / 2;
        const squareDist = xMinAbs ** 2 + yMinAbs ** 2;
        // should be inbounds, and unexplored
        return  squareDist < 32768 ** 2;
    }
    findNextChunk(chunk: Rectangle,BlockSize:number): Rectangle {
        const homeX = this.fromChunk.bottomLeft.x;
        const homeY = this.fromChunk.bottomLeft.y;
        const currX = chunk.bottomLeft.x;
        const currY = chunk.bottomLeft.y;
    
        const nextBottomLeft = { x: currX, y: currY };
      
        if (currX === homeX && currY === homeY) {
          nextBottomLeft.y = homeY + BlockSize;
        } else if (currY - currX > homeY - homeX && currY + currX >= homeX + homeY) {
          if (currY + currX === homeX + homeY) {
            // break the circle
            nextBottomLeft.y = currY + BlockSize;
          } else {
            nextBottomLeft.x = currX + BlockSize;
          }
        } else if (currX + currY > homeX + homeY && currY - currX <= homeY - homeX) {
          nextBottomLeft.y = currY - BlockSize;
        } else if (currX + currY <= homeX + homeY && currY - currX < homeY - homeX) {
          nextBottomLeft.x = currX -BlockSize;
        } else {
          // if (currX + currY < homeX + homeY && currY - currX >= homeY - homeX)
          nextBottomLeft.y = currY + BlockSize;
        }
    
        return {
          bottomLeft: nextBottomLeft,
          sideLength: BlockSize,
        };
    }
    public terrianTypeFromPerlin(perlin: number): TerrianType {
        if (perlin < TerrianType.Grass) {
            return TerrianType.Grass;
        } else if (perlin < TerrianType.Forest) {
            return TerrianType.Forest;
        } else if (perlin < TerrianType.Mountain) {
            return TerrianType.Mountain;
        }else if (perlin < TerrianType.Desert) {
            return TerrianType.Desert;
        }else if (perlin < TerrianType.Icefield) {
            return TerrianType.Icefield;
        }else {
            return TerrianType.Grass;
        }
  }   
  public terrianColorFromType(type: TerrianType): string {
    let result = "ffffff";
    switch (type) {
        case TerrianType.Grass:
            result = "00CC66";
            break;
        case TerrianType.Forest:
            result = "00991A";
            break;
        case TerrianType.Desert:
            result = "FFCC99";
            break;
        case TerrianType.Mountain:
            result = "E07000";
            break;
        case TerrianType.Icefield:
            result = "99CCFF";
            break;
        default:
            break;
    }
    return result;
    }
    popMessage(message:string){
        Laya.Scene.open("resources/prefab/P_Message.lh", false, {"text":message}); 
    }
    popGain(attr:string){
        Laya.Scene.open("resources/prefab/P_Gain.lh", false, {"attr":attr}); 
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