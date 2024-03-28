import {WeeklyPageHeader2} from "@/app/intern/weekly-editor/Header";
import {useWeeklyEditorStore, WeeklyParishItem} from "@/app/intern/weekly-editor/store";
import {CalendarName} from "@/domain/events/CalendarInfo";
import {ArticleComponent} from "./(components)/Article";
import {TeaserComponent} from "./(components)/Teaser";
import {useState} from "react";
import {WeeklyItemEditor} from "@/app/intern/weekly-editor/ParishEditor";
import {toast} from "react-toastify";
import isActive = toast.isActive;

export function PageParish(props: { calendar: CalendarName }) {

  const store = useWeeklyEditorStore(state => state);
  const isOn = (item: WeeklyParishItem) => item.parishes[props.calendar as 'emmaus']
    ? !!store.switchSideFor.find(a => a.parish === props.calendar && a.id === item.id)
    : undefined;
  const [active, setActive] = useState("")

  const columnStyle = "flex flex-col gap-6 h-full"
  return <div className="w-[21cm] h-[29.7cm] bg-white border border-black/20 p-12 flex flex-col mx-auto">
    {active && <div className="fixed top-0 left-0 w-full h-full bg-black/10" onClick={() => setActive("")}/>}
    <WeeklyPageHeader2 parish={props.calendar}/>
    <div className="h-full grid grid-cols-2 gap-6 my-6">
      <div className={columnStyle}>{store.items
        .filter(item => isOn(item) === false)
        .map(item => <ParishComponent
          key={item.id}
          item={item}
          calendar={props.calendar}
          onActive={() => setActive(active == item.id ? "" : item.id)}
          isActive={item.id === active}
        />)}
      </div>
      <div className={columnStyle}>{store.items
        .filter(item => isOn(item) === true)
        .map(item => <ParishComponent
          key={item.id}
          item={item}
          calendar={props.calendar}
          onActive={() => setActive(active == item.id ? "" : item.id)}
          isActive={item.id === active}
        />)}
      </div>
    </div>
  </div>;
}

function ParishComponent({item, calendar, ...props}: {
  item: WeeklyParishItem,
  calendar: CalendarName,
  onActive: () => void,
  isActive: boolean
}) {
  return <div className="relative grow flex flex-col">
    <div
      key={item.id}
      onClick={() => props.onActive()}
      className={(props.isActive ? "bg-white z-20" : "")+"hover:bg-black/5 break-inside-avoid text-sm border border-black/30 float-start rounded flex flex-col px-4 py-2 grow cursor-pointer"}
    >
      {item.type === "ARTICLE" && <ArticleComponent item={item}/>}
      {item.type === "TEASER" && <TeaserComponent item={item}/>}
    </div>
    {props.isActive && <>
        <WeeklyItemEditor item={item} calendar={calendar}/>
    </>}
  </div>
}
