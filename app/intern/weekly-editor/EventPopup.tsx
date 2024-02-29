import {CalendarEvent} from "@/domain/events/EventMapper";
import {useWeeklyEditorStore} from "@/app/intern/weekly-editor/store";
import {useUserStore} from "@/store/UserStore";
import {Permission} from "@/domain/users/Permission";
import {useState} from "react";
import {getEventUrl} from "@/domain/events/EventUrlResolver";

export function EventPopup(props: { showDescription: boolean, event: CalendarEvent }) {
  const store = useWeeklyEditorStore(state => state);
  const isCalendarAdmin = useUserStore(state => state.user?.permissions[Permission.CalendarAdministration])
  const [isLoading, setLoading] = useState(false)
  const showAbove = new Date(store.dateRange.end).getTime() - new Date(props.event.date).getTime() < 24 * 3600 * 1000 * 3
  const positionStyle = showAbove ? "top-0 -translate-y-full" : "bottom-0 translate-y-full"

  async function showInCalendar() {
    setLoading(true)
    const url = await getEventUrl(props.event.id, props.event.calendar);
    if (url)
      window.open(url, "_blank")
    setLoading(false)
  }

  const optionStyle = `px-1 py-0.5  rounded ${isLoading ? '' : 'hover:bg-black/5 cursor-pointer'}`;
  return <div
    className={`hidden group-hover:block bg-white p-2 shadow rounded absolute z-10 left-0 w-full whitespace-nowra  font-normal border border-black/20 ${positionStyle}`}>
    {!store.items.some(item => item.type === "TEASER" && item.eventId === props.event.id) && <div
        className={optionStyle}
        onClick={() => store.addItem({
          type: "TEASER",
          eventId: props.event.id,
          parishes: {emmaus: false, inzersdorf: false, neustift: false, [props.event.calendar]: true},
          preText: "", id:"",
          postText: props.event.description
        })}
    >
        Ankündigen
    </div>}
    <div
      className={optionStyle}
      onClick={() => store.toggleDescriptionFor(props.event.id)}
    >
      Beschreibung {props.showDescription ? "verbergen" : "anzeigen"}
    </div>
    {isCalendarAdmin && <div
        className={optionStyle}
        onClick={() => showInCalendar()}
    >
        Im Kalender anzeigen {isLoading && <>...</>}
    </div>}
  </div>;
}