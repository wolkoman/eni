import {parishes} from "@/app/intern/weekly-editor/WeeklyEventsPage";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";

export function WeeklyPageHeader() {
  return <div className="flex justify-between">
    <div className="opacity-70 leading-snug text-xs">
      Miteinder der Pfarren Emmaus, Inzersdorf (St. Nikolaus), Inzersdorf-Neustift<br/>
      eni.wien | +43 664 886 32 680
    </div>
    <div className="flex">{parishes.map(name =>
      <img src={getCalendarInfo(name).image} key={name} className="w-14"/>
    )}</div>
  </div>;
}
export function WeeklyPageHeader2(props: { parish: CalendarName }) {
  return <div className="flex justify-between relative">
    <div>
      <div className="text-lg">
        Informationen für die
      </div>
      <div className="text-2xl tracking-wide font-serif">
        {getCalendarInfo(props.parish).fullName}
      </div>
    </div>
    <img src={getCalendarInfo(props.parish).image} className="w-24 absolute bottom-0 right-0 translate-y-6"/>
  </div>;
}

export function WeeklyPageFooter() {
  return <div className="flex justify-between leading-snug text-xs opacity-70 mt-2">
    <div>
    Für den Inhalt verantwortlich: Pfarrer Dr. Zvonko Brezovski
    </div>
  </div>;
}