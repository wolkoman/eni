import {getWeekOfYear} from "@/app/(shared)/WeekOfYear";

export function WeeklyPageHeader(props: { lastDate: Date }) {
  return <div className="flex justify-between leading-snug text-xs opacity-70">
    <div>
      Miteinder der Pfarren Emmaus, Inzersdorf (St. Nikolaus), Inzersdorf-Neustift<br/>
      eni.wien | +43 664 886 32 680
    </div>
    <div className="text-xl font-thin"></div>
  </div>;
}