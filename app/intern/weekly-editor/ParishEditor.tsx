import {useWeeklyEditorStore, WeeklyParishItem} from "@/app/intern/weekly-editor/store";
import Button from "../../../components/Button";
import React, {createContext, Dispatch, SetStateAction, useEffect, useState} from "react";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {WeeklyArticleEditor} from "@/app/intern/weekly-editor/(components)/Article";
import {WeeklyTeaserEditor} from "@/app/intern/weekly-editor/(components)/Teaser";
import {PiArrowsLeftRightBold, PiTrashBold} from "react-icons/pi";


const ItemForm = createContext<[WeeklyParishItem, Dispatch<SetStateAction<WeeklyParishItem>>] | null>(null)

export function WeeklyItemEditor({item, calendar}: { item: WeeklyParishItem, calendar: CalendarName }) {
  const store = useWeeklyEditorStore(state => state)
  const form = useState(item)

  useEffect(() => {
    if (JSON.stringify(form[0]) != JSON.stringify(item))
      store.setItem(form[0]);
  }, [form[0]]);

  const side = store.switchSideFor.find(s => s.id === item.id && item.parishes[s.parish as CalendarName.EMMAUS]);
  return <ItemForm.Provider value={form}>
    <div
      className={`flex-col ${(side ? "right-2 -translate-x-full" : "left-2 translate-x-full")} my-4 gap-4 p-2 bg-gray-50 border border-black/20 rounded absolute -top-4 z-20 print:hidden w-full`}>
      {item.type === "ARTICLE" && <WeeklyArticleEditor form={form as any}/>}
      {item.type === "TEASER" && <WeeklyTeaserEditor form={form as any}/>}

      <div className="flex gap-3 justify-end">
        <div className={"flex gap-1 "}>
          {[
            CalendarName.EMMAUS as const,
            CalendarName.INZERSDORF as const,
            CalendarName.NEUSTIFT as const
          ].map(name => <img
            src={getCalendarInfo(name).dot}
            key={name}
            className={"text-center cursor-pointer w-6 " + (item.parishes[name] ? "" : ("opacity-40 grayscale " + (item.type === "TEASER" && "hidden")))}
            onClick={() => form[1](item => ({...item, parishes: {...item.parishes, [name]: !item.parishes[name]}}))}
          />)}
          <Button
            label={<div className="flex items-center gap-1"><PiArrowsLeftRightBold/> Wechseln</div>}
            onClick={() => store.toggleSideFor(item.id, calendar)}
          />
          <Button
            label={<div className="flex items-center gap-1"><PiTrashBold/> Löschen</div>}
            onClick={() => store.removeItem(item.id)}
          />
        </div>
      </div>

    </div>
  </ItemForm.Provider>;
}

