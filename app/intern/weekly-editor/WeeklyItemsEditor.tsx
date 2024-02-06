import {Article, Teaser, useWeeklyEditorStore, WeeklyParishItem} from "@/app/intern/weekly-editor/WeeklyEditorStore";
import Button from "../../../components/Button";
import React, {createContext, Dispatch, SetStateAction, useEffect, useState} from "react";
import {Field, SelfServiceInput} from "../../../components/SelfService";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";


export function WeeklyItemsEditor() {
  const store = useWeeklyEditorStore(state => state);
  return <div>
    {store.items.map((item, index) => <WeeklyItemEditor key={item.id} item={item}/>)}
  </div>;
}

const ItemForm = createContext<[WeeklyParishItem, Dispatch<SetStateAction<WeeklyParishItem>>] | null>(null)

function WeeklyItemEditor({item}: { item: WeeklyParishItem }) {
  const store = useWeeklyEditorStore(state => state)
  const form = useState(item)

  useEffect(() => {
    if (JSON.stringify(form[0]) != JSON.stringify(item))
      store.setItem(form[0]);
  }, [form[0]]);

  return <ItemForm.Provider value={form}>
    <div className="flex justify-between items-start my-4 gap-4 p-2 bg-gray-50 border border-black/20 rounded">
      {item.type === "ARTICLE" && <WeeklyArticleEditor form={form as any}/>}
      {item.type === "TEASER" && <WeeklyTeaserEditor form={form as any}/>}

      <div className="flex flex-col gap-3 items-end">
        <Button label="Löschen" onClick={() => store.removeItem(item.id)}/>
        <div className={"flex flex-col gap-1 " + (item.type === "TEASER" && "pointer-events-none")}>
        {[
          CalendarName.EMMAUS as const,
          CalendarName.INZERSDORF as const,
          CalendarName.NEUSTIFT as const
        ].map(name => <img
          src={getCalendarInfo(name).dot}
          key={name} className={"text-center cursor-pointer w-6 " + (item.parishes[name] ? "" : ("opacity-40 grayscale " + (item.type === "TEASER" && "hidden")))}
          onClick={() => form[1](item => ({...item, parishes: {...item.parishes, [name]: !item.parishes[name]}}))}
        />)}
        </div>
      </div>

    </div>
  </ItemForm.Provider>;
}

function WeeklyArticleEditor({form}: { form: [Article, Dispatch<SetStateAction<Article>>] }) {

  return <div className="grid gap-2 grow">
    <div className="grid grid-cols-2 gap-2">
      <Field label="Titel"><SelfServiceInput name="title" form={form}/></Field>
      <Field label="Autor:in"><SelfServiceInput name="author" form={form}/></Field>
    </div>
    <Field label="Text"><SelfServiceInput name="text" form={form} input="textarea"/></Field>
  </div>;
}

function WeeklyTeaserEditor({form}: { form: [Teaser, Dispatch<SetStateAction<Teaser>>] }) {
  const events = useWeeklyEditorStore(state => state.events)
  const event = events.find(e => e.id === form[0].eventId)
  return <div className="grid gap-2 grow">
    <div className="font-bold text-lg">Terminankündigung: {event?.summary}</div>
    <div className="grid grid-cols-2 gap-2 grow">
      <Field label="Vor dem Veranstaltungsnamen">
        <SelfServiceInput name="preText" form={form} input="textarea"/>
      </Field>
      <Field label="Nach dem Veranstaltungsnamen">
        <SelfServiceInput name="postText" form={form} input="textarea"/>
      </Field>
    </div>
  </div>;
}