import {WeeklyPageHeader, WeeklyPageHeader2} from "@/app/intern/weekly-editor/WeeklyPageHeader";
import {Article, Teaser, useWeeklyEditorStore, WeeklyParishItem} from "@/app/intern/weekly-editor/WeeklyEditorStore";
import {getWeekDayName} from "../../../components/calendar/Calendar";
import {CalendarName} from "@/domain/events/CalendarInfo";

export function WeeklyParishPage(props: { calendar: CalendarName }) {

  const store = useWeeklyEditorStore(state => state);
  const isOn = (item: WeeklyParishItem) => item.parishes[props.calendar as 'emmaus']
    ? !!store.switchSideFor.find(a => a.parish === props.calendar && a.id === item.id)
    : undefined;

  const columnStyle = "flex flex-col justify-stretch gap-6 h-full"
  return <div className="w-[21cm] h-[29.7cm] border border-black/20 p-20 flex flex-col mx-auto">
    <WeeklyPageHeader2 parish={props.calendar}/>
    <div className="h-full grid grid-cols-2 gap-6 my-6">
      <div className={columnStyle}>{store.items
        .filter(item => isOn(item) === false)
        .map((item, index) => <div
          key={item.id}
          className="contents"
          onClick={() => store.toggleSideFor(item.id, props.calendar)}
        >
          {item.type === "ARTICLE" && <ArticleComponent item={item}/>}
          {item.type === "TEASER" && <TeaserComponent item={item}/>}
        </div>)}</div>
      <div className={columnStyle}>{store.items
        .filter(item => isOn(item) === true)
        .map((item, index) => <div className="contents" onClick={() => store.toggleSideFor(item.id, props.calendar)}>
          {item.type === "ARTICLE" && <ArticleComponent item={item} key={index}/>}
          {item.type === "TEASER" && <TeaserComponent item={item} key={index}/>}
        </div>)}</div>
    </div>
  </div>;
}

const componentStyle = "break-inside-avoid text-sm border border-gray-400 float-start rounded flex flex-col justify-center";

function ArticleComponent({item}: { item: Article }) {
  return <div className={`${componentStyle} px-6 py-4`}>
    <div className="flex justify-between my-3 items-center">
      <div className="font-bold text-lg leading-tight">{item.title}</div>
      <div className="italic shrink-0 text-xs" dangerouslySetInnerHTML={{__html: item.author}}/>
    </div>
    <div className="font-serif" dangerouslySetInnerHTML={{__html: item.text}}/>
  </div>
}

function TeaserComponent({item}: { item: Teaser }) {
  const events = useWeeklyEditorStore(state => state.events)
  const event = events.find(event => event.id === item.eventId)
  return <div className={`${componentStyle} text-center px-6 py-4`}>
    <div className="" dangerouslySetInnerHTML={{__html: item.preText.replace("\n","<br/>")}}/>
    <div className="flex flex-col justify-center my-6 items-center">
      <div className="font-bold text-2xl ">{event?.summary}</div>
      <div className="text-lg ">am {getWeekDayName(new Date(event?.date ?? "").getDay())},
        den {event?.date.split("-").reverse().join(".").substring(0, 6)}<br/>um {event?.time} Uhr
      </div>
    </div>
    <div className="" dangerouslySetInnerHTML={{__html: item.postText.replace("\n","<br/>")}}/>
  </div>
}