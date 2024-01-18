"use client"
import {useWeeklyEditorStore} from "@/store/weeklyEditor/WeeklyEditorStore";
import {WeeklyEventsPage} from "@/app/intern/weekly-editor/WeeklyEventsPage";
import {LiturgyData} from "../../../pages/api/liturgy";
import {Field, SelfServiceInput} from "../../../components/SelfService";
import Button from "../../../components/Button";
import {SectionHeader} from "../../../components/SectionHeader";
import {useStoreState} from "@/app/(shared)/UseStoreState";

export function WeeklyEditor(props: { liturgy: LiturgyData }) {

  const store = useWeeklyEditorStore(state => state);
  const dateRangeForm = useStoreState(store, "dateRange", "setDateRange");

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
      <Button loading={store.loading} onClick={() => store.load()} label="Termine laden"/>
    </div>

    <WeeklyEventsPage events={store.events} liturgy={props.liturgy}/>

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
      <Button loading={store.loading} onClick={() => store.load()} label="Termine laden"/>
    </div>
  </div>;
}