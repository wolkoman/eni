"use client"

import {LiturgyData} from "../../pages/api/liturgy";
import {useState} from "../(shared)/use-state-util";
import {Preference, usePreferenceStore} from "@/store/PreferenceStore";
import React from "react";
import Site from "../../components/Site";
import Responsive from "../../components/Responsive";
import {CalendarCacheNotice} from "../../components/calendar/CalendarCacheNotice";
import {Settings} from "../../components/Settings";
import {MonthView} from "../../components/calendar/MonthView";
import {ListView} from "../../components/calendar/ListView";
import {FilterSelector} from "../../components/calendar/FilterSelector";
import {EventEdit, EventEditBackground} from "../../components/calendar/EventEdit";
import {CalendarEvent, EventsObject} from "@/domain/events/EventMapper";
import {getCalendarInfo} from "@/domain/events/CalendarInfo";
import {useCalendarStore} from "@/store/CalendarStore";
import {useUserStore} from "@/store/UserStore";
import {Permission} from "@/domain/users/Permission";
import {useFilterState} from "@/app/termine/useFilterState";
import {EventSearch} from "../../components/calendar/EventSearch";
import {CalendarErrorNotice} from "../../components/calendar/CalendarErrorNotice";
import {EniLoading} from "../../components/Loading";
import {applyFilter} from "../../components/calendar/Calendar";

export function AddEvent() {
  const [isEditing, setIsEditing] = useState(false);
  const user = useUserStore(state => state.user);
  return user?.permissions[Permission.PrivateCalendarAccess] ? <>
    <div
      className={`p-3 rounded-lg bg-black/5 ${isEditing || 'cursor-pointer'} static lg:relative`}
      onClick={() => setIsEditing(true)}
    >
      <div className="w-6 aspect-square">
        <svg viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M45.5 9V82" stroke="#484848" strokeWidth="18" strokeLinecap="round"/>
          <path d="M82 45.5L9 45.5" stroke="#484848" strokeWidth="18" strokeLinecap="round"/>
        </svg>
      </div>
      {isEditing && <EventEdit
          onClose={() => setIsEditing(false)} parish={user.parish}
          suggestion={{date: "", time: "", description: "", summary: ""}}
      />}
    </div>
    {isEditing && <EventEditBackground onClick={() => setIsEditing(false)}/>}
  </> : <></>;
}

export interface ReducedCalendarState {
  items: CalendarEvent[],
  error: boolean,
  loading: boolean,
  loaded: boolean
}

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
    : {items: props.eventsObject.events, error: false, loading: false, loaded: true, load: () => {}};
  const [monthView] = usePreferenceStore(Preference.MonthView);
  const [seperateMass] = usePreferenceStore(Preference.SeparateMass)
  const items = applyFilter(calendar.items, filter, seperateMass).filter(event => !search || (event.summary + event.description + event.mainPerson + event.groups.join(" ")).toLowerCase().includes(search.toLowerCase()));

  return <Site responsive={false}>
    <Responsive>
      <CalendarCacheNotice/>
      <div className="flex-grow mt-4 pb-4 relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="font-bold text-4xl mb-6">
              Termine{filter !== null && ": "}
              {filter?.filterType === "GROUP" && filter.group}
              {filter?.filterType === "PARISH" && getCalendarInfo(filter.parish).shortName}
            </div>
          </div>
          <div className="flex gap-2">
            <AddEvent/>
            <Settings/>
          </div>
        </div>

        <div className="flex flex-col gap-1 my-4">
            <EventSearch onChange={setSearch} filter={filter}/>
            <FilterSelector
                filter={filter}
                setFilter={filter => setFilter(filter)}
                userPermissions={user?.permissions ?? {}}
            />
        </div>

        {calendar.error && <CalendarErrorNotice/>}
        {calendar.loading && <EniLoading/>}
      </div>
    </Responsive>
    {monthView
      ? <MonthView search={search} items={items} liturgy={props.liturgy} filter={filter}/>
      : <Responsive>
        <ListView search={search} items={items} liturgy={props.liturgy} filter={filter} editable={true}/>
      </Responsive>
    }
  </Site>;
}
