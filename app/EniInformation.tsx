import {Section} from "../components/Section";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import Link from "next/link";


function Person(props: { img: string; name: string; role: string; mail: string; }) {
  return;
}

export function EniInformation() {
  return <>
    <Section id="personal" title="Unsere Priester">
      <div className="flex gap-4 items-stretch">
        <div className="flex-1 flex flex-col items-center text-center rounded-lg shadow-lg bg-white">
          <div className="grow flex flex-col justify-center">
            <div className="text-lg font-semibold">Gil Vicente Thomas</div>
            <div className="italic">Aushilfskaplan</div>
            <a className="underline" href="mailto:kaplan.e@eni.wien">kaplan.e@eni.wien</a>
          </div>
          <div className=" aspect-square w-full lg:w-52 relative bg-[url(/personal/gil.png)] bg-cover"/>
        </div>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden flex-[3] flex">
          <div className="flex flex-col items-center justify-center text-center grow">
            <div className="font-bold italic text-xl">Fürchte dich nicht,<br/>du hast Gnade bei Gott gefunden!</div>
            <div className="text-lg font-semibold mt-4">Pfarrer Dr. Zvonko Brezovski</div>
            <a className="underline" href="mailto:pfarrer@eni.wien">pfarrer@eni.wien</a>
          </div>
          <div style={{backgroundImage: `url(/personal/zvonko.png)`}}
               className="bg-cover aspect-square w-full lg:w-80"/>
        </div>

      </div>
    </Section>
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