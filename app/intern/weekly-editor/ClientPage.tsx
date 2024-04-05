"use client"
import {LiturgyData} from "../../../pages/api/liturgy";
import {Field, SelfServiceInput} from "../../../components/SelfService";
import Button from "../../../components/Button";
import {SectionHeader} from "../../../components/SectionHeader";
import {useStoreState} from "@/app/(shared)/UseStoreState";
import React, {useEffect} from "react";
import {useWeeklyEditorStore} from "@/app/intern/weekly-editor/store";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {PiArchiveBold, PiArrowCounterClockwiseBold, PiPlusBold, PiTrashBold} from "react-icons/pi";
import {getWeekOfYear} from "@/app/(shared)/WeekOfYear";
import {ParishDot} from "../../../components/calendar/ParishDot";
import {PageEvents} from "@/app/intern/weekly-editor/(events-page)/PageEvents";
import {PageParish} from "@/app/intern/weekly-editor/(announcements)/PageParish";


export function ClientPage(props: { liturgy: LiturgyData }) {

  const store = useWeeklyEditorStore();
  const dateRangeForm = useStoreState(store, "dateRange", "setDateRange");
  useEffect(function initialLoading() {
    store.loadAnnouncements()
  }, []);


  const sectionClass = "print:hidden max-w-2xl mx-auto py-10";

  const lastDate = new Date(store.events.at(-1)?.date!);
  const defaultName = `KW${getWeekOfYear(lastDate)} ${lastDate.getFullYear()}`
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
        <Field label="Name">
          <div className="flex gap-1">
            <SelfServiceInput name="name" form={dateRangeForm} type="text"/>
            {dateRangeForm[0].name != defaultName && <Button
                onClick={() => store.setDateRange({...dateRangeForm[0], name: defaultName})}
                label={<PiArrowCounterClockwiseBold
                  className="mt-2"
                />}/>}

          </div>
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
        <div className="flex flex-col gap-2">
          {store.announcements.map(announcement => <div
            key={announcement._id}
            className="flex flex-col gap-2 p-4 bg-white rounded border border-black/10 items-start"
          >
            <div className="flex gap-2 items-center">
              <ParishDot info={getCalendarInfo(announcement.parish as any)} private={false}/>
              <div
                className="text-sm opacity-70">{announcement.byName} {new Date(announcement._created * 1000).toLocaleString("de-AT")}</div>
            </div>
            <div>{announcement.description}</div>
            <div className="flex gap-1 self-end">
              <Button
                sure={true}
                label={<div className="flex gap-1 items-center"><PiArchiveBold/> Verwerfen</div>}
                onClick={() => store.removeAnnouncement(announcement._id)}/>
              <Button
                label={<div className="flex gap-1 items-center"><PiPlusBold/> Hinzufügen</div>}
                onClick={() => store.addItem({
                  type: "ARTICLE" as const,
                  title: "", id: "",
                  author: announcement.byName,
                  text: announcement.description + announcement.files.map(f => `<img src='${f}'/>`),
                  parishes: {
                    emmaus: announcement.parish === "emmaus",
                    inzersdorf: announcement.parish === "inzersdorf",
                    neustift: announcement.parish === "neustift"
                  },
                })}/>
            </div>
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

