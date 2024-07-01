"use client"

import {LiturgyData} from "../../pages/api/liturgy";
import {useState} from "@/app/(shared)/use-state-util";
import React from "react";
import Site from "../../components/Site";
import Responsive from "../../components/Responsive";
import {CalendarCacheNotice} from "@/components/calendar/CalendarCacheNotice";
import {ListView} from "@/components/calendar/ListView";
import {EventsObject} from "@/domain/events/EventMapper";
import {useCalendarStore} from "@/store/CalendarStore";
import {useUserStore} from "@/store/UserStore";
import {useFilterState} from "@/app/termine/useFilterState";
import {EventSearch} from "@/components/calendar/EventSearch";
import {CalendarErrorNotice} from "@/components/calendar/CalendarErrorNotice";
import {EniLoading} from "@/components/Loading";
import {applyFilter} from "@/components/calendar/Calendar";
import {AddEvent} from "@/app/termine/AddEvent";

export default function EventPage(props: {
    liturgy: LiturgyData,
    eventsObject: EventsObject,
}) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useFilterState()
    const user = useUserStore(state => state.user);
    const calendarStore = useCalendarStore(state => state);
    const calendar = user
        ? calendarStore
        : {
            items: props.eventsObject.events,
            error: false,
            loading: false,
            loaded: true,
            load: () => {
            }
        };
    const items = applyFilter(calendar.items, filter).filter(event => !search || (event.summary + event.description + event.mainPerson + event.groups.join(" ")).toLowerCase().includes(search.toLowerCase()));

    return <Site
        responsive={false} showTitle={true}
        title={`Termine${filter !== null ? ": " : ""}${filter?.filterType === "GROUP" ? filter.group : ""}`}>
        <Responsive>
            <CalendarCacheNotice/>
            <div className="flex-grow mt-4 pb-4 relative">
                <div className="flex gap-2 justify-between items-end mb-2">
                    <EventSearch onChange={setSearch} filter={filter}/>
                    <AddEvent/>
                </div>
                {calendar.error && <CalendarErrorNotice/>}
                {calendar.loading && <EniLoading/>}
            </div>
        </Responsive>
        <Responsive>
            <ListView search={search} items={items} liturgy={props.liturgy} filter={filter} editable={true}/>
        </Responsive>
    </Site>;
}
