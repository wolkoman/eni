import {WeeklyPageHeader2} from "@/app/intern/weekly-editor/Header";
import {useWeeklyEditorStore, WeeklyParishItem} from "@/app/intern/weekly-editor/store";
import {CalendarName} from "@/domain/events/CalendarInfo";
import { ArticleComponent } from "./(components)/Article";
import { TeaserComponent } from "./(components)/Teaser";
import {useState} from "react";
import {WeeklyItemEditor} from "@/app/intern/weekly-editor/ParishEditor";

export function PageParish(props: { calendar: CalendarName }) {

  const store = useWeeklyEditorStore(state => state);
  const isOn = (item: WeeklyParishItem) => item.parishes[props.calendar as 'emmaus']
    ? !!store.switchSideFor.find(a => a.parish === props.calendar && a.id === item.id)
    : undefined;

  const columnStyle = "flex flex-col gap-6 h-full"
  return <div className="w-[21cm] h-[29.7cm] border border-black/20 p-12 flex flex-col mx-auto">
    <WeeklyPageHeader2 parish={props.calendar}/>
    <div className="h-full grid grid-cols-2 gap-6 my-6">
      <div className={columnStyle}>{store.items
        .filter(item => isOn(item) === false)
        .map(item => <ParishComponent
          key={item.id}
          item={item}
          calendar={props.calendar}
        />)}
      </div>
      <div className={columnStyle}>{store.items
        .filter(item => isOn(item) === true)
        .map(item => <ParishComponent
          key={item.id}
          item={item}
          calendar={props.calendar}
        />)}
      </div>
    </div>
  </div>;
}

function ParishComponent({item, calendar}: {
  item: WeeklyParishItem,
  calendar: CalendarName
}) {
  const [details, setDetails] = useState(false)
  return <div
    key={item.id}
    className="break-inside-avoid text-sm border border-black/30 float-start rounded flex flex-col px-4 py-2 relative grow"
  >
    <div onClick={() => setDetails(x => !x)} className="hover:bg-black/5 cursor-pointer h-full">
    {item.type === "ARTICLE" && <ArticleComponent item={item}/>}
    {item.type === "TEASER" && <TeaserComponent item={item}/>}
    </div>
    {details && <>
        <WeeklyItemEditor item={item} calendar={calendar}/>
    </>}
  </div>
}
