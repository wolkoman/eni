"use client"
import {PageEvents} from "@/app/intern/weekly-editor/PageEvents";
import {LiturgyData} from "../../../pages/api/liturgy";
import {Field, SelfServiceInput} from "../../../components/SelfService";
import Button from "../../../components/Button";
import {SectionHeader} from "../../../components/SectionHeader";
import {useStoreState} from "@/app/(shared)/UseStoreState";
import {PageParish} from "@/app/intern/weekly-editor/PageParish";
import {useEffect} from "react";
import {useWeeklyEditorStore} from "@/app/intern/weekly-editor/store";
import {CalendarName} from "@/domain/events/CalendarInfo";


export function ClientPage(props: { liturgy: LiturgyData }) {

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

    <PageEvents events={store.events} liturgy={props.liturgy}/>

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
      </div>
    </div>

    <PageParish calendar={CalendarName.EMMAUS}/>
    <div className="my-8 print:hidden"/>
    <PageParish calendar={CalendarName.INZERSDORF}/>
    <div className="my-8 print:hidden"/>
    <PageParish calendar={CalendarName.NEUSTIFT}/>

  </div>;
}

