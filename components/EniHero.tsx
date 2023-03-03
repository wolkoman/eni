import {ReactNode} from "react";
import Responsive from "./Responsive";

function ParishText(props: { children: ReactNode, width: number, color: string }) {
    return <span className="relative inline-block font-bold">
        {props.children}
        <svg className="absolute w-full -bottom-2 " viewBox="0 0 215 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className={"stroke-current " + props.color} d="M5 8.50001C34 3.50001 178.5 2.50001 210 14.5"
              strokeWidth={props.width} strokeLinecap="round"/>
        </svg>
    </span>;
}

export function EniHero() {
    return <Responsive>
        <div className="my-20 text-5xl leading-tight text-black">
            Miteinander der Pfarren <ParishText width={10} color="text-emmaus">Emmaus</ParishText><br/>
            <ParishText color="text-inzersdorf" width={7}>St. Nikolaus</ParishText> und <ParishText color="text-neustift" width={12}>Neustift</ParishText>
        </div>
    </Responsive>;
}