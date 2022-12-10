import React, {useEffect} from 'react';
import {usePermission} from '../../util/use-permission';
import Site from '../../components/Site';
import Button from '../../components/Button';
import {Permission} from '../../util/verify';
import {TemplateHandler} from 'easy-template-x';
import sanitize from 'sanitize-html';
import {useState} from '../../util/use-state-util';
import {getWeekDayName} from '../../components/calendar/Calendar';
import {useCalendarStore} from '../../util/use-calendar-store';
import {saveFile} from "../../util/save-file";
import {CalendarEvent, CalendarGroup, CalendarTag} from "../../util/calendar-types";
import {groupEventsByDate} from "../../util/group-events-by-group-and-date";

export default function InternArticles() {
    usePermission([Permission.Admin]);
    const [data, , setPartialData] = useState({start: new Date(), end: new Date()});
    const [events, loaded, load] = useCalendarStore(state => [state.items, state.loaded, state.load])

    useEffect(() => load(), [load])

    function pad(num: number) {
        return `${num < 10 ? '0' : ''}${num}`
    }

    function toTime(dateTime: string) {
        const date = new Date(dateTime);
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    function toCalEevent(event: CalendarEvent) {
        const special = event.groups.includes(CalendarGroup.Messe);
        return {
            [special ? 'specialtime' : 'time']: toTime(event.start.dateTime),
            [special ? 'specialtitle' : 'title']: event.summary + (event.mainPerson ? ` / ${event.mainPerson}` : ""),
            description: event.description.toString().trim().length > 0 ? `\n${sanitize(event.description.trim())}` : ""
        };
    }

    async function generate() {
        const response = await fetch('/eni.docx');
        const templateFile = await response.blob();
        const from = data.start.toISOString().split("T")[0].split('-').reverse().join('.').substring(0, 5);
        const to = data.end.toISOString().split("T")[0].split('-').reverse().join('.').substring(0, 10);
        const wordData = {
            daterange: `${from}. - ${to}`,
            event: Object.entries(groupEventsByDate(events))
                .filter(([date]) => data.start.getTime() <= new Date(date).getTime() && data.end.getTime() >= new Date(date).getTime())
                .map(([date, events]) => ({date, events: events.filter(e => e.visibility === "public")}))
                .map(({date, events: allEvents}) => {
                    const day = new Date(date).getDay();
                    const events = allEvents.filter(event => !event.tags.includes(CalendarTag.cancelled));
                    return ({
                        sundaydate: day === 0 ? `${getWeekDayName(day)}, ${date.split('-').reverse().join('.').substring(0, 5)}.` : '',
                        date: day !== 0 ? `${getWeekDayName(day)}, ${date.split('-').reverse().join('.').substring(0, 5)}.` : '',
                        emmaus: events.filter(event => event.calendar === 'emmaus').map(toCalEevent),
                        inzersdorf: events.filter(event => event.calendar === 'inzersdorf').map(toCalEevent),
                        neustift: events.filter(event => event.calendar === 'neustift').map(toCalEevent),
                    });
                }),
        };

        const handler = new TemplateHandler();
        const doc = await handler.process(templateFile, wordData as any);

        saveFile('wochenmitteilung.docx', doc);
    }

    return <Site title="Wochenmitteilungen" narrow={true}>
        <div className="flex flex-col items-center mx-auto">
           <div>
                <div className="mt-4 text-sm">Start</div>
                <input type="date" className="bg-gray-200 px-3 py-1 rounded"
                       onChange={(e) => setPartialData({start: new Date(e.target.value)})}/>
            </div>
            <div>
                <div className="mt-4 text-sm">Ende</div>
                <input type="date" className="bg-gray-200 px-3 py-1 rounded"
                       onChange={(e) => setPartialData({end: new Date(e.target.value)})}/>
            </div>
            <Button className="mt-4" label="Generieren" onClick={() => generate()} disabled={!loaded}/>
        </div>
    </Site>;
}
