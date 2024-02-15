"use client"
import {WeeklyEventsPage} from "@/app/intern/weekly-editor/WeeklyEventsPage";
import {LiturgyData} from "../../../pages/api/liturgy";
import {Field, SelfServiceInput} from "../../../components/SelfService";
import Button from "../../../components/Button";
import {SectionHeader} from "../../../components/SectionHeader";
import {useStoreState} from "@/app/(shared)/UseStoreState";
import {WeeklyParishPage} from "@/app/intern/weekly-editor/WeeklyParishPage";
import {useEffect} from "react";
import {useWeeklyEditorStore} from "@/app/intern/weekly-editor/WeeklyEditorStore";
import {WeeklyItemsEditor} from "@/app/intern/weekly-editor/WeeklyItemsEditor";
import {CalendarName} from "@/domain/events/CalendarInfo";


export function WeeklyEditor(props: { liturgy: LiturgyData }) {

  const store = useWeeklyEditorStore(state => state);
  const dateRangeForm = useStoreState(store, "dateRange", "setDateRange");
  useEffect(function initialLoading() {
    store.loadAnnouncements()
  }, []);


  const sectionClass = "print:hidden max-w-2xl mx-auto py-10";
  return <div>

    <div className={sectionClass}>
      <SectionHeader>Terminseite</SectionHeader>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Startdatum">
          <SelfServiceInput name="start" form={dateRangeForm} type="date"/>
        </Field>
        <Field label="Enddatum">
          <SelfServiceInput name="end" form={dateRangeForm} type="date"/>
        </Field>
      </div>
      <Button loading={store.loading} onClick={() => store.loadEvents()} label="Termine laden"/>
    </div>

    <WeeklyEventsPage events={store.events} liturgy={props.liturgy}/>

    <div className={sectionClass}>
      <SectionHeader>Pfarrseite</SectionHeader>
      <div className="grid gap-4">
        <div>
          <Button loading={store.loading} onClick={() => store.insertEvangelium()} label="Evangelium einfügen"/>
        </div>
        <div>
          {store.announcements.map(announcement => <div key={announcement._id}>
            <div>{announcement.description}</div>
            <Button label="Add" onClick={() => store.addItem({
              type: "ARTICLE" as const,
              title: "", id: "",
              author: announcement.byName,
              text: announcement.description + announcement.files.map(f => `<img src='${f}'/>`),
              parishes: {emmaus: announcement.parish === "emmaus", inzersdorf: announcement.parish === "inzersdorf", neustift: announcement.parish === "neustift"},
            })}/>
          </div>)
          }
        </div>
        <WeeklyItemsEditor/>
      </div>
    </div>

    <WeeklyParishPage calendar={CalendarName.EMMAUS}/>
    <div className="my-8 print:hidden"/>
    <WeeklyParishPage calendar={CalendarName.INZERSDORF}/>
    <div className="my-8 print:hidden"/>
    <WeeklyParishPage calendar={CalendarName.NEUSTIFT}/>

  </div>;
}

