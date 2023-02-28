import {SectionHeader} from "./SectionHeader";

export function Personal() {
    return <>
        <SectionHeader id="personal">Priester</SectionHeader>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-24">
            <Person img="/personal/zvonko.png" name="Dr. Zvonko Brezovski" role="Pfarrer" mail="pfarrer"/>
            <Person img="/personal/marcin.png" name="Marcin Wojciech" role="Pfarrvikar" mail="pfarrvikar"/>
            <Person img="/personal/gil.png" name="Gil Vicente Thomas" role="Aushilfskaplan" mail="kaplan.e"/>
            <Person img="/personal/david.png" name="David Campos" role="Aushilfskaplan" mail="kaplan.in"/>
        </div>
    </>;
}

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
