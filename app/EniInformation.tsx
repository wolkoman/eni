import {Section} from "../components/Section";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import Link from "next/link";


function Person(props: { img: string; name: string; role: string; mail: string; }) {
  return;
}

export function EniInformation() {
  return <>
    <Section title="Unsere Pfarren">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        <Parish name={CalendarName.EMMAUS} index={0}/>
        <Parish name={CalendarName.INZERSDORF} index={1}/>
        <Parish name={CalendarName.NEUSTIFT} index={2}/>
      </div>
    </Section></>;
}

function Parish(props: { name: CalendarName; index: number }) {
  const info = getCalendarInfo(props.name);
  return <div className="flex flex-col items-center text-center w-full">
    <div className={"rounded-lg overflow-hidden h-44 relative w-full " + info.className}>
      <div
          style={{backgroundImage: `url(${info.image})`}}
          className="w-full h-full rounded-lg bg-contain bg-no-repeat bg-bottom"
      />
    </div>
    <div className="text-xl font-bold mt-4">{info.fullName}</div>
    <div className="italic">{info.address}</div>
    <Link href={`${info.websiteUrl}`}>
      <div className="underline hover:no-underline cursor-pointer">{info.websiteDisplay}</div>
    </Link>
  </div>
}
