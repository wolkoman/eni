import {CalendarEvent} from "@/domain/events/EventMapper";
import {CalendarGroup} from "@/domain/events/CalendarGroup";
import {useWeeklyEditorStore} from "@/app/intern/weekly-editor/store";
import {EventPopup} from "@/app/intern/weekly-editor/EventPopup";

export function Event(props: { event: CalendarEvent }) {
  const special = props.event.groups.includes(CalendarGroup.Messe)
  const mainPersons = {
    "Brez": "Pfr. Z.B.",
    "Marcin": "Pfv. M.",
    "Gil": "Kpl. G.",
    "David": "Kpl. D.",
  }
  const store = useWeeklyEditorStore(state => state);
  const summary = props.event.summary.replaceAll("Sakramentenvorbereitung Versöhnung und Kommunion", "Sakramenten​vorbereitung")
  const showDescription = !store.hideDescriptionForIds.includes(props.event.id)

  return <div
    className={`flex ${special ? 'font-semibold' : ''} ${showDescription ? '' : 'border-l border-red-500 print:border-0'} mb-0.5 group relative`}>
    <div className="w-[1cm] shrink-0">{props.event.time}</div>
    <div className="w-full">
      <div className="">
        <div className="inline">{summary}</div>
        {Object.entries(mainPersons)
          .filter(([name]) => props.event.mainPerson?.includes(name))
          .map(([_, initial]) =>
            <div className="text-xs font-normal opacity-50 rounded pl-1.5 inline-block">{initial}</div>
          )}
      </div>
      {showDescription && <div>
        {props.event.description.split("\n").map(text => <div className="text-xs font-normal leading-tight">{text}</div>)}
      </div>}
    </div>

    <EventPopup event={props.event} showDescription={showDescription}/>

  </div>;
}