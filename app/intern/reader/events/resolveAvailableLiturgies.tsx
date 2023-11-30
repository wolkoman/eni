import {LiturgyData} from "../../../../pages/api/liturgy";
import {CalendarEvent} from "../../../(domain)/events/EventMapper";

export function resolveAvailableLiturgies(liturgy: LiturgyData, event: CalendarEvent) {
    const afterSunset = new Date(event.start.dateTime).getHours() >= 18
    if(afterSunset){
        const tomorrow = new Date(new Date(event.date).getTime()+1000*3600*24).toISOString().substring(0,10)
        return [...liturgy[event.date], ...liturgy[tomorrow]];
    }else{
        return liturgy[event.date];
    }
}
