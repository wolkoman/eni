import {applyFilter, FilterType} from "./Calendar";
import {LiturgyData} from "../../pages/api/liturgy";
import {Preference, usePreference} from "../../util/use-preference";
import {useState} from "../../util/use-state-util";
import {Settings} from "../Settings";
import {CalendarErrorNotice} from "./CalendarErrorNotice";
import {EniLoading} from "../Loading";
import {groupEventsByDate} from "../../util/use-calendar-store";
import {CalendarGroup, CalendarTag} from "../../util/calendar-types";
import {Event, Event2} from "./Event";
import {LiturgyInformation} from "./LiturgyInformation";
import React, {ReactNode} from "react";
import {AddEvent, ReducedCalendarState} from "../../pages/termine";
import {EventSearch} from "./EventSearch";
import {EventDate, EventDate2} from "./EventUtils";
import {FilterSelector2} from "./FilterSelector";

export function ListView(props: { filter: FilterType, liturgy: LiturgyData, calendar: ReducedCalendarState }) {
    const [searchActive] = usePreference(Preference.Search);
    const [separateMass] = usePreference(Preference.SeparateMass);
    const [search, setSearch] = useState("");
    return <>
        <div className="flex justify-between items-center mb-6">
            <div>
                <div className="font-bold text-4xl mb-6">Termine</div>
                {searchActive && <EventSearch onChange={setSearch} filter={props.filter}/>}
            </div>
            <div className="flex gap-2">
                <AddEvent/>
                <Settings/>
            </div>
        </div>
        {props.calendar.error && <CalendarErrorNotice/>}
        {props.calendar.loading && <EniLoading/>}
        {props.calendar.loading || Object.entries(groupEventsByDate(applyFilter(props.calendar.items
                .filter(event => !search || (event.summary + event.description + (event.tags.includes(CalendarTag.singleEvent) ? "" : "Einzelevent")).toLowerCase().includes(search.toLowerCase())),
            props.filter, separateMass)))
            .map(([date, events]) => <div key={date} data-date={date} className="py-2">
                <EventDate date={new Date(date)}/>
                <LiturgyInformation liturgies={props.liturgy[date]}/>
                {events.map(event => <Event key={event.id} event={event} enableEditing={true}/>)}
            </div>)}
    </>;
}


export function ListView2(props: { filter: FilterType, liturgy: LiturgyData, calendar: ReducedCalendarState, filterSlot: ReactNode }) {
    const [searchActive] = usePreference(Preference.Search);
    const [separateMass] = usePreference(Preference.SeparateMass);
    const [search, setSearch] = useState("");
    return <>
        <div className="flex justify-between items-center mb-6">
            <div>
                <div className="font-bold text-4xl mb-6">Termine</div>
                {searchActive && <EventSearch onChange={setSearch} filter={props.filter}/>}
            </div>
            <div className="flex gap-2">
                <AddEvent/>
                <Settings/>
            </div>
        </div>
        {props.filterSlot}
        {props.calendar.error && <CalendarErrorNotice/>}
        {props.calendar.loading && <EniLoading/>}
        {props.calendar.loading || Object.entries(groupEventsByDate(applyFilter(props.calendar.items
                .filter(event => !search || (event.summary + event.description + (event.tags.includes(CalendarTag.singleEvent) ? "" : "Einzelevent")).toLowerCase().includes(search.toLowerCase())),
            props.filter, separateMass)))
            .map(([date, events]) => <div key={date} data-date={date} className="py-2 flex flex-col lg:flex-row border-b border-black/10">
                <div className="w-[130px]">
                    <EventDate2 date={new Date(date)}/>
                </div>
                <div className="grow">
                    <LiturgyInformation liturgies={props.liturgy[date]}/>
                    {events.map(event => <Event2 key={event.id} event={event} enableEditing={true}/>)}
                </div>
            </div>)}
    </>;
}