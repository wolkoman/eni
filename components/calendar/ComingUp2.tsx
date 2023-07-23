"use client"

import React from 'react';
import {groupEventsByDate,} from '../../util/store/use-calendar-store';
import {useEmmausProd} from "../../util/use-emmaus-prod";
import {EventsObject} from "../../util/calendar-types";
import {ListView} from "./ListView";
import {Clickable} from "../../app/(components)/Clickable";
import {getMonthName, getWeekDayName} from "./Calendar";

export function ComingUp2(props: { eventsObject: EventsObject }) {
  const events = Object.entries(groupEventsByDate(props.eventsObject.events))
  const urlPrefix = useEmmausProd() ? 'https://eni.wien' : '';

  return  <div className="my-8">
      <div className={`grid`}>
        {events.slice(0, 5).map(([date, events]) => {
          const d = new Date(date);
            return <div key={date} className="p-4 rounded-xl relative overflow-hidden">
              <div className="text-xl font-semibold underline my-2">
                {getWeekDayName(d.getDay())}, {d.getDate()}. {getMonthName(d.getMonth())}
              </div>
              <div>
                <ListView hideDate={true} editable={false} calendar={{
                  items: events,
                  error: false,
                  loading: false,
                  loaded: true
                }} liturgy={{}} filter={null}/>
              </div>
            </div>;
          }
        )}
        <Clickable href={`${urlPrefix}/termine`} className="rounded-2xl text-xl text-center font-bold p-4 block">
          Alle Termine
        </Clickable>
      </div>
    </div>;
}
