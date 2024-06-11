"use client"
import {useWeeklyEditorStore, WeeklyParishItem} from "@/app/intern/wochenmitteilungen-editor/store";
import React, {createContext, Dispatch, SetStateAction, useEffect, useState} from "react";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {PiArrowsLeftRightBold, PiTrashBold} from "react-icons/pi";
import {WeeklyArticleEditor} from "@/app/intern/wochenmitteilungen-editor/(announcements)/(components)/Article";
import {WeeklyTeaserEditor} from "@/app/intern/wochenmitteilungen-editor/(announcements)/(components)/Teaser";
import Button from "../../../../components/Button";


const ItemForm = createContext<[WeeklyParishItem, Dispatch<SetStateAction<WeeklyParishItem>>] | null>(null)

export function WeeklyItemEditor({item}: { item: WeeklyParishItem }) {
  const store = useWeeklyEditorStore(state => state)
  const form = useState(item)

  useEffect(() => {
    if (JSON.stringify(form[0]) != JSON.stringify(item))
      store.setItem(form[0]);
  }, [form[0]]);

  return <ItemForm.Provider value={form}>
    <div className={`flex-col gap-4 bg-white print:hidden w-full`}>
      {item.type === "ARTICLE" && <WeeklyArticleEditor form={form as any}/>}
      {item.type === "TEASER" && <WeeklyTeaserEditor form={form as any}/>}

      <div className="flex gap-3 justify-end">
        <div className={"flex gap-1 "}>
          {[
            CalendarName.EMMAUS as const,
            CalendarName.INZERSDORF as const,
            CalendarName.NEUSTIFT as const
          ].map(name => {
            const isClickable = !(Object.values(item.parishes).reduce((p,c) => p+(c?1:0), 0) == 1 && item.parishes[name])
            return <div
              key={name}
              className={`rounded ${isClickable && "cursor-pointer"} ${getCalendarInfo(name).className} ${item.parishes[name] ? "" : (`opacity-20 grayscale ${item.type === "TEASER" && "hidden"}`)}`}
              onClick={isClickable ? () => form[1](item => ({...item, parishes: {...item.parishes, [name]: !item.parishes[name]}})) : undefined}
            >
              <img className="w-8" src={getCalendarInfo(name).dot}/>
            </div>;
          })}
          <Button
            label={<div className="flex items-center gap-1"><PiTrashBold/> Löschen</div>}
            onClick={() => store.removeItem(item.id)}
          />
        </div>
      </div>

    </div>
  </ItemForm.Provider>;
}

