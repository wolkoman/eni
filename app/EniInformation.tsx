import {Section} from "../components/Section";
import {CalendarName, getCalendarInfo} from "./(domain)/events/CalendarInfo";
import {motion} from "framer-motion";
import Link from "next/link";


function Person(props: { img: string; name: string; role: string; mail: string; }) {
  return <div className="flex flex-col items-center text-center">
    <div className="rounded-lg shadow-lg aspect-square w-full lg:w-52 relative overflow-hidden">
      <div style={{backgroundImage: `url(${props.img})`}} className="absolute inset-0 bg-cover"/>
    </div>
    <div className="text-xl font-bold mt-4">{props.name}</div>
    <div className="italic">{props.role}</div>
    <div className="underline ">{props.mail}@eni.wien</div>
  </div>;
}

export function EniInformation() {
  return <>
    <Section id="personal" title="Unsere Priester">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
        <Person img="/personal/zvonko.png" name="Dr. Zvonko Brezovski" role="Pfarrer" mail="pfarrer"/>
        <Person img="/personal/marcin.png" name="Marcin Wojciech" role="Pfarrvikar" mail="pfarrvikar"/>
        <Person img="/personal/gil.png" name="Gil Vicente Thomas" role="Aushilfskaplan" mail="kaplan.e"/>
        <Person img="/personal/david.png" name="David Campos" role="Aushilfskaplan" mail="kaplan.in"/>
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
      <motion.div
        style={{backgroundImage: `url(${info.image})`}}
        className="w-full h-full rounded-lg bg-contain bg-no-repeat bg-bottom"
        whileInView={{translateY: 0, scale: 1, opacity: 1}}
        transition={{delay: 0.1 * props.index, bounce: 0}}
        initial={{translateY: 50, opacity: .9}}
      />
    </div>
    <div className="text-xl font-bold mt-4">{info.fullName}</div>
    <div className="italic">{info.address}</div>
    <Link href={`${info.websiteUrl}`}>
      <div className="underline hover:no-underline cursor-pointer">{info.websiteDisplay}</div>
    </Link>
  </div>
}