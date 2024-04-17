"use client";

import React from 'react';
import {CalendarEvent} from "@/domain/events/EventMapper";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import sanitize from "sanitize-html";
import Site from "../../../components/Site";
import {usePermission} from "../../(shared)/UsePermission";
import {Permission} from "@/domain/users/Permission";
import {AnnouncementsEntries} from "./AnnouncementsEntries";
import {WeeklyUpload} from "./WeeklyUpload";
import {WeeklySend} from "./WeeklySend";

export function WeeklyPage() {
    usePermission([Permission.Admin]);

    function toTime(dateTime: string) {
        const date = new Date(dateTime);
        return `${date.toLocaleTimeString().substring(0,5)}`
    }

    function toWordData(event: CalendarEvent) {
        const special = event.groups.includes(CalendarGroup.Messe);
        const isDescription = event.description.toString().trim().length > 0;
        const description = `\n${sanitize(event.description.replaceAll("<br/>", "\n").trim(), {allowedTags: []})}`
        return {
            [special ? 'specialtime' : 'time']: toTime(event.start.dateTime),
            [special ? 'specialtitle' : 'title']: event.summary,
            description: (event.mainPerson ? ` (${event.mainPerson})` : '') + (isDescription ? description : '')
        };
    }

    return <Site title="Wochenmitteilungen" narrow={true}>
            <AnnouncementsEntries/>
            <WeeklyUpload/>
            <WeeklySend/>
    </Site>;
}


