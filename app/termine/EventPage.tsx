"use client"

import {LiturgyData} from "../../pages/api/liturgy";
import {useState} from "../../util/use-state-util";
import {FilterType} from "../../components/calendar/Calendar";
import {useAuthenticatedUserStore} from "../../util/store/use-user-store";
import {useCalendarStore} from "../../util/store/use-calendar-store";
import {Preference, usePreference} from "../../util/store/use-preference";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect} from "react";
import Site from "../../components/Site";
import Responsive from "../../components/Responsive";
import {CalendarCacheNotice} from "../../components/calendar/CalendarCacheNotice";
import {Settings} from "../../components/Settings";
import {MonthView} from "../../components/calendar/MonthView";
import {ListView} from "../../components/calendar/ListView";
import {FilterSelector} from "../../components/calendar/FilterSelector";
import {Permission} from "../../util/verify";
import {EventEdit, EventEditBackground} from "../../components/calendar/EventEdit";
import {CalendarEvent, EventsObject} from "./EventMapper";
import {CalendarGroup} from "./CalendarGroup";
import {CalendarName, getCalendarInfo} from "./CalendarInfo";

export function AddEvent() {
  const [isEditing, setIsEditing] = useState(false);
  const {user} = useAuthenticatedUserStore();
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
  const [filter, setFilter] = useState<FilterType>(null);
  const [firstFilterUpdate, setFirstFilterUpdate] = useState(true);
  const {user} = useAuthenticatedUserStore();
  const calendarStore = useCalendarStore(state => state);
  const calendar = user
    ? calendarStore
    : {items: props.eventsObject.events, error: false, loading: false, loaded: true};
  const [monthView] = usePreference(Preference.MonthView);
  const {replace: routerReplace} = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("q")) setFilter({filterType: "GROUP", group: searchParams.get("q") as CalendarGroup})
    if (searchParams.get("p")) setFilter({filterType: "PARISH", parish: searchParams.get("p") as CalendarName})
  }, [searchParams]);
  useEffect(() => {
    if (!firstFilterUpdate) {
      routerReplace("?" + Object.entries({
        q: filter?.filterType !== "GROUP" ? null : filter.group,
        p: filter?.filterType !== "PARISH" ? null : filter.parish
      })
        .filter(([a, b]) => b)
        .map(([a, b]) => `${a}=${b}`)
        .join("&")
      )
    } else {
      setFirstFilterUpdate(false);
    }
  }, [filter]);

  return <Site responsive={false}>
    <Responsive>
      <div data-testid="calendar" className="relative">
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
          {monthView
            ? <MonthView calendar={calendar} liturgy={props.liturgy} filter={filter}/>
            : <ListView calendar={calendar} liturgy={props.liturgy} filter={filter} editable={true} filterSlot={
              <FilterSelector
                filter={filter}
                setFilter={filter => setFilter(filter)}
                userPermissions={user?.permissions ?? {}}
              />
            }/>
          }
        </div>
      </div>
    </Responsive>
  </Site>;
}
