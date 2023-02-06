import {applyFilter, FilterType} from "./Calendar";
import {LiturgyData} from "../../pages/api/liturgy";
import {Preference, usePreference} from "../../util/use-preference";
import {useState} from "../../util/use-state-util";
import {Settings} from "../Settings";
import {CalendarErrorNotice} from "./CalendarErrorNotice";
import {EniLoading} from "../Loading";
import {groupEventsByDate, useAuthenticatedCalendarStore} from "../../util/use-calendar-store";
import {CalendarTag} from "../../util/calendar-types";
import {Event} from "./Event";
import {LiturgyInformation} from "./LiturgyInformation";
import React, {ReactNode} from "react";
import {AddEvent, ReducedCalendarState} from "../../pages/termine";
import {EventSearch} from "./EventSearch";
import {EventDate} from "./EventUtils";
import {EventEdit, EventEditBackground} from "./EventEdit";
import {useAuthenticatedUserStore} from "../../util/use-user-store";
import {Permission} from "../../util/verify";
import {
    applySuggestionToPatch,
    EventSuggestion,
    getSuggestionFromDiff,
    getSuggestionFromEvent
} from "../../util/suggestion-utils";
import {CalendarName} from "../../util/calendar-info";

export function ListView(props: { filter: FilterType, liturgy: LiturgyData, calendar: ReducedCalendarState, filterSlot: ReactNode }) {
    const [separateMass] = usePreference(Preference.SeparateMass);
    const [search, setSearch] = useState("");
    const {user} = useAuthenticatedUserStore();
    const {openSuggestions: allOpenSuggestions} = useAuthenticatedCalendarStore();
    const openSuggestions = allOpenSuggestions.filter(sug => sug.by === user?._id || user?.permissions[Permission.CalendarAdministration]);
    const [editEventId, setEditEventId] = useState<string | undefined>(undefined);
    return <>
        <div className="flex justify-between items-center mb-6">
            <div>
                <div className="font-bold text-4xl mb-6">Termine</div>
            </div>
            <div className="flex gap-2">
                <AddEvent/>
                <Settings/>
            </div>
        </div>
        <div className="flex flex-col gap-1 my-4">
            <EventSearch onChange={setSearch} filter={props.filter}/>
            {props.filterSlot}
        </div>

        {props.calendar.error && <CalendarErrorNotice/>}
        {props.calendar.loading && <EniLoading/>}
        {props.calendar.loading || Object.entries(groupEventsByDate(applyFilter(props.calendar.items
                .filter(event => !search || (event.summary + event.description + event.mainPerson + event.groups.map(group => `gruppe:${group}`).join(",") + (event.tags.includes(CalendarTag.singleEvent) ? "" : "Einzelevent")).toLowerCase().includes(search.toLowerCase())),
            props.filter, separateMass)))
            .map(([date, events]) => <div key={date} data-date={date}
                                          className="py-2 flex flex-col lg:flex-row border-b border-black/10">
                <div className="w-[130px] my-2">
                    <EventDate date={new Date(date)}/>
                </div>
                <div className="grow">
                    <LiturgyInformation liturgies={props.liturgy[date]}/>
                    {events
                        .map(event => ({event, suggestion: openSuggestions.find(sug => sug.eventId === event.id)}))
                        .map(({event, suggestion}) => ({event, suggestion: suggestion ? applySuggestionToPatch(suggestion, event) : null}))
                        .map(({event, suggestion}) =>
                            <EditableEvent
                                editable={!!(user?.permissions[Permission.PrivateCalendarAccess] && event.start.dateTime && (user.parish === "all" || user.parish === event.calendar))}
                                isEdited={event.id === editEventId}
                                id={event.id} parish={event.calendar}
                                suggestionForm={suggestion?.suggestion ? getSuggestionFromDiff(suggestion.suggestion) : getSuggestionFromEvent(event)}
                                onEditEvent={setEditEventId}
                                arguments={{event, suggestion: suggestion?.suggestion}}
                            />)}

                    {openSuggestions
                        .filter(suggestion => suggestion.type === "add" && suggestion.data.date[0][1] === date)
                        .map(suggestion =>
                            <EditableEvent
                                editable={true}
                                isEdited={`suggestion_${suggestion._id}` === editEventId}
                                id={`suggestion_${suggestion._id}`}
                                parish={suggestion.parish}
                                suggestionForm={getSuggestionFromDiff(suggestion)}
                                onEditEvent={setEditEventId}
                                arguments={{event: {}, suggestion}}
                            />)}
                </div>
            </div>)}
        {editEventId && <EventEditBackground onClick={() => setEditEventId(undefined)}/>}
    </>;
}

export function EditableEvent(props: { editable: boolean, isEdited: boolean, id: string, parish: CalendarName, suggestionForm: EventSuggestion, onEditEvent: (eventId?: string) => void, arguments: Parameters<typeof Event>[0] }) {
    return <div
        className={props.editable ? 'cursor-pointer relative' : ''}
        onClick={props.editable ? () => props.onEditEvent(props.id) : () => {
        }}
    >
        <Event key={props.id} event={props.arguments.event} suggestion={props.arguments.suggestion}/>
        {props.isEdited && <EventEdit parish={props.parish} eventId={props.id}
                                      onClose={() => props.onEditEvent()}
                                      suggestion={props.suggestionForm}/>}
    </div>;
}