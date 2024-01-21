import {useWeeklyEditorStore} from "@/store/weeklyEditor/WeeklyEditorStore";
import {WeeklyPageHeader} from "@/app/intern/weekly-editor/WeeklyPageHeader";

export function WeeklyParishPage() {

  const store = useWeeklyEditorStore(state => state);

  return <div className="w-[21cm] h-[29.7cm] border border-black/20 p-12 flex flex-col mx-auto">
    <WeeklyPageHeader lastDate={new Date(store.dateRange.end)}/>
    <div className="columns-2 col h-full my-8 gap-6">
    <div className="break-inside-avoid text-sm">
      <div className="flex justify-between my-2 items-center">
        <div className=" font-bold text-lg ">Das Evangelium vom Sonntag</div>
        <div className="italic" dangerouslySetInnerHTML={{__html: store.evangelium.place}}/>
      </div>
      <div className="font-serif" dangerouslySetInnerHTML={{__html: store.evangelium.text}}/>
    </div>
    </div>
  </div>;
}