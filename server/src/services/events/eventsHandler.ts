import  {EventEmitter} from 'events'
import logger from "../logger/logger";

export interface IEventHandler{
    subscribe<T>(eventName:string,callback:(data:T)=>Promise<void>):void
    unsubscribe<T>(eventName:string,callback:(data:T)=>Promise<void>):void
    unsubscribeAll(eventName:string):void
    triggerEvent<T>(eventName:string,data?:T):void

}
interface IEvent{
    eventName:string
    callback: (data:any)=>Promise<void>
}

class EventsHandler  extends EventEmitter implements IEventHandler{
    private eventQueue:IEvent[] = []

    subscribe<T>(eventName: string, callback: (data: T) => Promise<void>): void {
        logger.info("subscribe",eventName,callback)
        this.eventQueue.push({
            eventName:eventName,
            callback:callback
        })
    }

    unsubscribe<T>(eventName: string, callback: (data: T) => Promise<void>): void {
        logger.info("unsubscribe",eventName,callback)
        for (let i in this.eventQueue){
            let event = this.eventQueue[i]
            if (eventName === event.eventName && event.callback === callback ){
                this.eventQueue.splice(Number(i))
            }
        }
    }

    triggerEvent<T>(eventName: string,data?:T): void {
        logger.info("triggerEvent",eventName,data)
        for (let i in this.eventQueue){
            let event = this.eventQueue[i]
            if (eventName === event.eventName){
                event.callback(data).then(()=>{
                    this.eventQueue.splice(Number(i));
                }).catch((err)=>{
                    console.log("err when callback",err)
                })
            }
        }
    }
    unsubscribeAll(eventName: string) {
        logger.info("unsubscribeAll",eventName)
        for (let i in this.eventQueue){
            let event = this.eventQueue[i]
            if (eventName === event.eventName){
                this.eventQueue.splice(Number(i));
            }
        }
    }
}
const eventsHandler = new EventsHandler();
export {eventsHandler}