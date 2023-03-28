import React, {MutableRefObject, useRef} from 'react';
import {usePdf} from "@mikecousins/react-pdf";
import Site from "../components/Site";
import {motion} from 'framer-motion'
import {CalendarName, getCalendarInfo} from "../util/calendar-info";

const MyPdfViewer = () => {
    const canvasRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    usePdf({file: '/api/weekly?parish=emmaus', page: 2, canvasRef: canvasRefs[1], scale: 0.45})
    usePdf({file: '/api/weekly?parish=inzersdorf', page: 2, canvasRef: canvasRefs[2], scale: 0.45})
    usePdf({file: '/api/weekly?parish=neustift', page: 2, canvasRef: canvasRefs[3], scale: 0.45})

    return (
        <Site title="Wochenmitteilungen">
            <div className="flex">
                <div className="">
                    <div className="text-4xl font-bold my-6 lg:my-12">
                        Wochenmitteilungen
                    </div>
                    <div className="max-w-xl my-6">
                        Gottesdienste, Veranstaltungen und Ankündigungen jede Woche neu. Sie können sich auch gerne für
                        den Newsletter registrieren: Schicken Sie dazu eine Mail mit der gewünschten Pfarre an
                        kanzlei@eni.wien.
                    </div>
                    <div className="flex flex-col lg:flex-row gap-2">
                        <Page href="/api/weekly?parish=emmaus" canvas={canvasRefs} index={0}
                              calendar={CalendarName.EMMAUS}/>
                        <Page href="/api/weekly?parish=inzersdorf" canvas={canvasRefs} index={1}
                              calendar={CalendarName.INZERSDORF}/>
                        <Page href="/api/weekly?parish=neustift" canvas={canvasRefs} index={2}
                              calendar={CalendarName.NEUSTIFT}/>
                    </div>
                </div>
            </div>
        </Site>
    );
};

function Page(props: { canvas: MutableRefObject<null>[], index: number, href?: string, calendar: CalendarName }) {
    const info = getCalendarInfo(props.calendar);
    return <motion.a whileHover={{zIndex: 10, scale: 1.05}} style={{zIndex: 3 - props.index}}
                     className={`block max-w-full flex flex-col mx-auto border-8 rounded-lg ${info.borderColor} ${info.className} overflow-hidden shadow-lg`}
                     href={props.href}>
        <div className={` px-4 pb-2`}>{info.fullName}</div>
        <canvas className={`w-[267px] h-[378px] rounded`} ref={props.canvas[props.index + 1]}/>
    </motion.a>
}

export default MyPdfViewer;