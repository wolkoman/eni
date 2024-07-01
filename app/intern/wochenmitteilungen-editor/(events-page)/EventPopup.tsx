import {CalendarEvent} from "@/domain/events/EventMapper";
import {useWeeklyEditorStore} from "@/app/intern/wochenmitteilungen-editor/store";
import {useUserStore} from "@/store/UserStore";
import {Permission} from "@/domain/users/Permission";
import {useState} from "react";
import {getEventUrl} from "@/domain/events/EventUrlResolver";

export function EventPopup(props: { event: CalendarEvent }) {
  const store = useWeeklyEditorStore(state => state);
  const isCalendarAdmin = useUserStore(state => state.user?.permissions[Permission.CalendarAdministration])
  const [isLoading, setLoading] = useState(false)
  const showAbove = new  Date(store.dateRange.end).getTime() - new Date(props.event.date).getTime() < 24 * 3600 * 1000 * 3
  const positionStyle = showAbove ? "top-0 -translate-y-full  flex-col-reverse" : "bottom-0 translate-y-full  flex-col"

  async function showInCalendar() {
    setLoading(true)
    const url = await getEventUrl(props.event.id);
    if (url)
      window.open(url, "_blank")
    setLoading(false)
  }

  const optionStyle = `px-3 py-0.5 ${isLoading ? '' : 'hover:bg-black/5 cursor-pointer'}`;
  const hasCustomDescription = store.customEventDescription[props.event.id] != props.event.description && store.customEventDescription[props.event.id] != null;
  return <div className={`hidden group-hover:flex absolute z-10 left-0 ${positionStyle} gap-1`}>
    <div className="w-full font-normal border border-black/20 bg-white py-1 shadow rounded">
      {!store.items.some(item => item.type === "TEASER" && item.eventId === props.event.id) && <div
          className={optionStyle}
          onClick={() => store.addItem({
            type: "TEASER",
            eventId: props.event.id,
            preText: "", id: "",
            postText: props.event.description
          })}
      >
          Ankündigen
      </div>}
      {isCalendarAdmin && <div
          className={optionStyle}
          onClick={() => showInCalendar()}
      >
          Im Kalender anzeigen {isLoading && <>...</>}
      </div>}
      {hasCustomDescription &&
          <div
              className={optionStyle}
              onClick={() => store.setCustomDescription(props.event.id, null)}
          >
              Beschreibung rücksetzen
          </div>}
    </div>
    {hasCustomDescription && <div className="w-full font-normal border border-black/20 bg-gray-50 p-2 shadow rounded text-xs">
      {props.event.description}
    </div>}
  </div>;
}
