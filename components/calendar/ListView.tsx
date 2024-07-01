import {FilterType} from "./Calendar";
import {LiturgyData} from "../../pages/api/liturgy";
import {useState} from "@/app/(shared)/use-state-util";
import {useCalendarStore} from "@/store/CalendarStore";
import React, {useRef} from "react";
import {EventDate} from "./EventUtils";
import {Event} from "./Event";
import {ViewportList} from "react-viewport-list";
import {EventEdit, EventEditBackground} from "./EventEdit";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {useUserStore} from "@/store/UserStore";
import {EventSuggestion} from "@/domain/suggestions/EventSuggestions";
import {
    applySuggestionToPatch,
    getSuggestionFromDiff,
    getSuggestionFromEvent
} from "@/domain/suggestions/SuggestionsMapper";
import {Permission} from "@/domain/users/Permission";
import {groupEventsByDate} from "@/domain/events/CalendarGrouper";
import {CalendarEvent} from "@/domain/events/EventMapper";

export function ListView(props: {
    search: string,
    filter: FilterType,
    liturgy: LiturgyData,
    items: CalendarEvent[],
    editable: boolean
}) {
    const user = useUserStore(state => state.user);
    const allOpenSuggestions = useCalendarStore(state => state.openSuggestions);
    const openSuggestions = allOpenSuggestions.filter(sug => sug.by === user?._id || user?.permissions[Permission.CalendarAdministration]);
    const items = Object.entries(groupEventsByDate(props.items));

    const [editEventId, setEditEventId] = useState<string | undefined>(undefined);
    const ref = useRef<HTMLDivElement | null>(null);
    return <div>
        <div ref={ref}>
            <ViewportList
                viewportRef={ref}
                items={items}
            >
                {(([date, events], index, all) => <div
                    key={date + index}
                    data-date={date}
                    className={`py-2 flex flex-col lg:flex-row border-black/10 ${index + 1 !== all.length ? 'border-b' : ''}`}
                >
                    <div className="lg:w-[150px] my-1 shrink-0">
                        <EventDate date={new Date(date)} liturgies={props.liturgy[date]} showLiturgyInfo={props.editable}/>
                    </div>
                    <div className="grow">
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
                                    key={event.id}
                                    editable={!!(user?.permissions[Permission.PrivateCalendarAccess] && event.start.dateTime) && props.editable}
                                    isEdited={event.id === editEventId}
                                    id={event.id}
                                    suggestionForm={suggestion?.suggestion ? getSuggestionFromDiff(suggestion.suggestion) : getSuggestionFromEvent(event)}
                                    onEditEvent={setEditEventId}
                                    arguments={{event, suggestion: suggestion?.suggestion}}
                                />)}

                        {openSuggestions
                            .filter(suggestion => suggestion.type === "add" && suggestion.data.date[0][1] === date)
                            .map((suggestion, index) =>
                                <EditableEvent
                                    key={index}
                                    editable={props.editable}
                                    isEdited={`suggestion_${suggestion._id}` === editEventId}
                                    id={`suggestion_${suggestion._id}`}
                                    suggestionForm={getSuggestionFromDiff(suggestion)}
                                    onEditEvent={setEditEventId}
                                    arguments={{event: {}, suggestion}}
                                />)}
                    </div>
                </div>)}
            </ViewportList>
        </div>
        {editEventId && <EventEditBackground onClick={() => setEditEventId(undefined)}/>}
    </div>;
}

export function EditableEvent(props: {
    editable: boolean,
    isEdited: boolean,
    id: string,
    suggestionForm: EventSuggestion,
    onEditEvent: (eventId?: string) => void,
    arguments: Parameters<typeof Event>[0],
}) {
    return <div
      className={props.editable ? 'cursor-pointer relative' : ''}
      onClick={props.editable ? () => props.onEditEvent(props.id) : () => {
      }}
    >
        <Event
          key={props.id}
          event={props.arguments.event}
          suggestion={props.arguments.suggestion}
        />
        {props.isEdited && <EventEdit
          eventId={props.id}
          onClose={() => props.onEditEvent()}
          suggestion={props.suggestionForm}/>}
    </div>;
}
