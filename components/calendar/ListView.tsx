import {applyFilter, FilterType} from "./Calendar";
import {LiturgyData} from "../../pages/api/liturgy";
import {Preference, usePreference} from "../../util/use-preference";
import {useState} from "../../util/use-state-util";
import {CalendarErrorNotice} from "./CalendarErrorNotice";
import {EniLoading} from "../Loading";
import {groupEventsByDate, useAuthenticatedCalendarStore} from "../../util/use-calendar-store";
import {LiturgyInformation} from "./LiturgyInformation";
import React, {ReactNode, useRef} from "react";
import {ReducedCalendarState} from "../../pages/termine";
import {EventSearch} from "./EventSearch";
import {EventDate} from "./EventUtils";
import {Event} from "./Event";
import {useAuthenticatedUserStore} from "../../util/use-user-store";
import {Permission} from "../../util/verify";
import {
    applySuggestionToPatch,
    EventSuggestion,
    getSuggestionFromDiff,
    getSuggestionFromEvent
} from "../../util/suggestion-utils";
import {ViewportList} from "react-viewport-list";
import {EventEdit, EventEditBackground} from "./EventEdit";
import {CalendarName} from "../../util/calendar-info";

export function ListView(props: { filter: FilterType, liturgy: LiturgyData, calendar: ReducedCalendarState, filterSlot?: ReactNode, editable: boolean }) {
    const [separateMass] = usePreference(Preference.SeparateMass);
    const [search, setSearch] = useState("");
    const {user} = useAuthenticatedUserStore();
    const {openSuggestions: allOpenSuggestions} = useAuthenticatedCalendarStore();
    const openSuggestions = allOpenSuggestions.filter(sug => sug.by === user?._id || user?.permissions[Permission.CalendarAdministration]);
    const items = Object.entries(groupEventsByDate(applyFilter(props.calendar.items
            .filter(event => !search || (event.summary + event.description + event.mainPerson + event.groups.map(group => `gruppe:${group}`).join(",")).toLowerCase().includes(search.toLowerCase())),
        props.filter, separateMass)));

    const [editEventId, setEditEventId] = useState<string | undefined>(undefined);
    const ref = useRef<HTMLDivElement | null>(null);
    return <div>
        {props.filterSlot && <div className="flex flex-col gap-1 my-4">
            <EventSearch onChange={setSearch} filter={props.filter}/>
            {props.filterSlot}
        </div>}

        {props.calendar.error && <CalendarErrorNotice/>}
        {props.calendar.loading && <EniLoading/>}
        {props.calendar.loading ||

            <div className="scroll-container" ref={ref}>
                <ViewportList
                    viewportRef={ref}
                    items={items}
                >
                    {(([date, events], index, all) => <div
                        key={date}
                        data-date={date}
                        className={`py-2 flex flex-col lg:flex-row border-black/10 ${index + 1 !== all.length ? 'border-b' : ''}`}
                    >
                        <div className="w-[130px] my-2  shrink-0">
                            <EventDate date={new Date(date)}/>
                        </div>
                        <div className="grow">
                            <LiturgyInformation liturgies={props.liturgy[date]}/>
                            {events
                                .map(event => ({
                                    event,
                                    suggestion: openSuggestions.find(sug => sug.eventId === event.id)
                                }))
                                .map(({event, suggestion}) => ({
                                    event,
                                    suggestion: suggestion ? applySuggestionToPatch(suggestion, event) : null
                                }))
                                .map(({event, suggestion}) =>
                                    <EditableEvent
                                        small={!props.filterSlot}
                                        editable={!!(user?.permissions[Permission.PrivateCalendarAccess] && event.start.dateTime && (user.parish === "all" || user.parish === event.calendar)) && props.editable}
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
                                        small={!props.filterSlot}
                                        editable={props.editable}
                                        isEdited={`suggestion_${suggestion._id}` === editEventId}
                                        id={`suggestion_${suggestion._id}`}
                                        parish={suggestion.parish}
                                        suggestionForm={getSuggestionFromDiff(suggestion)}
                                        onEditEvent={setEditEventId}
                                        arguments={{event: {}, suggestion}}
                                    />)}
                        </div>
                    </div>)}
                </ViewportList>
            </div>}
        {editEventId && <EventEditBackground onClick={() => setEditEventId(undefined)}/>}
    </div>;
}

export function EditableEvent(props: {
    editable: boolean,
    isEdited: boolean,
    id: string,
    parish: CalendarName,
    suggestionForm: EventSuggestion,
    onEditEvent: (eventId?: string) => void,
    arguments: Parameters<typeof Event>[0],
    small?: boolean
}) {
    return <div
        className={props.editable ? 'cursor-pointer relative' : ''}
        onClick={props.editable ? () => props.onEditEvent(props.id) : () => {
        }}
    >
        <Event key={props.id} event={props.arguments.event} suggestion={props.arguments.suggestion}
               small={props.small}/>
        {props.isEdited && <EventEdit parish={props.parish} eventId={props.id}
                                      onClose={() => props.onEditEvent()}
                                      suggestion={props.suggestionForm}/>}
    </div>;
}