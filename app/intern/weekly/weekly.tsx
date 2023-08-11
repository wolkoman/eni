"use client";

import React from 'react';
import {groupEventsByDate, useCalendarStore} from "../../(store)/CalendarStore";
import {CalendarEvent, CalendarTag} from "../../(domain)/events/EventMapper";
import {CalendarGroup} from "../../(domain)/events/CalendarGroup";
import sanitize from "sanitize-html";
import {getWeekDayName} from "../../../components/calendar/Calendar";
import {TemplateHandler} from "easy-template-x";
import Site from "../../../components/Site";
import Button from "../../../components/Button";
import {useState} from "../../(shared)/use-state-util";
import {usePermission} from "../../(shared)/UsePermission";
import {Permission} from "../../(domain)/users/Permission";
import {saveFile} from "../../(shared)/BrowserBlobSaver";
import {AnnouncementsEntries} from "./AnnouncementsEntries";
import {WeeklyUpload} from "./WeeklyUpload";
import {WeeklySend} from "./WeeklySend";

export function WeeklyPage() {
    usePermission([Permission.Admin]);
    const [data, , setPartialData] = useState({start: new Date(), end: new Date()});
    const [events, loaded] = useCalendarStore(state => [state.items, state.loaded])

    function pad(num: number) {
        return `${num < 10 ? '0' : ''}${num}`
    }

    function toTime(dateTime: string) {
        const date = new Date(dateTime);
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`
    }

    function toCalEevent(event: CalendarEvent) {
        const special = event.groups.includes(CalendarGroup.Messe);
        const isDescription = event.description.toString().trim().length > 0;
        const description = `\n${sanitize(event.description.replaceAll("<br/>", "\n").trim(), {allowedTags: []})}`
        return {
            [special ? 'specialtime' : 'time']: toTime(event.start.dateTime),
            [special ? 'specialtitle' : 'title']: event.summary,
            description: (event.mainPerson ? `\nmit ${event.mainPerson}` : '') + (isDescription ? description : '')
        };
    }

    async function generate(file: string) {
        const response = await fetch(file);
        const templateFile = await response.blob();
        const from = data.start.toISOString().split("T")[0].split('-').reverse().join('.').substring(0, 5);
        const to = data.end.toISOString().split("T")[0].split('-').reverse().join('.').substring(0, 10);
        const year = new Date(data.end.getFullYear(), 0, 1);
        const days = Math.floor((data.end.getTime() - year.getTime()) / (24 * 60 * 60 * 1000));
        const week = Math.ceil((data.end.getDay() + days) / 7);
        const wordData = {
            daterange: `${from}. - ${to}.`,
            kw: week,
            year: data.end.getFullYear(),
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
        <div className="">
            <div className="text-3xl font-bold my-4">Vorlage erstellen</div>
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
            <Button className="mt-4" label="Generieren" onClick={() => generate("/eni.docx")} disabled={!loaded}/>
            <AnnouncementsEntries/>
            <WeeklyUpload/>
            <WeeklySend/>
        </div>
    </Site>;
}


