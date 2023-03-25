import React, {MutableRefObject, useRef} from 'react';
import {usePdf} from "@mikecousins/react-pdf";
import Site from "../components/Site";
import {motion} from 'framer-motion'
import Link from "next/link";

const MyPdfViewer = () => {
    const canvasRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const pdfs = [
        usePdf({file: '/api/weekly?parish=emmaus', page: 1, canvasRef: canvasRefs[0], scale: 0.75}),
        usePdf({file: '/api/weekly?parish=emmaus', page: 2, canvasRef: canvasRefs[1], scale: 0.45}),
        usePdf({file: '/api/weekly?parish=inzersdorf', page: 2, canvasRef: canvasRefs[2], scale: 0.45}),
        usePdf({file: '/api/weekly?parish=neustift', page: 2, canvasRef: canvasRefs[3], scale: 0.45})
    ];

    return (
        <Site title="Wochenmitteilungen" showTitle={true}>
            <canvas className={`border border-gray-300 rounded-xl`} ref={canvasRefs[0]}/>
            <div className="flex flex-col lg:flex-row">
                <Page canvas={canvasRefs} index={0} className="border-gray-300"/>
                <Page href="/api/weekly?parish=emmaus" canvas={canvasRefs} index={1} className="border-emmaus lg:-ml-60"/>
                <Page href="/api/weekly?parish=inzersdorf" canvas={canvasRefs} index={2}
                      className="border-inzersdorf lg:-ml-60"/>
                <Page href="/api/weekly?parish=neustift" canvas={canvasRefs} index={3}
                      className="border-neustift lg:-ml-60"/>
            </div>
        </Site>
    );
};

function Page(props: { canvas: MutableRefObject<null>[], index: number, className: string, href?: string }) {
    return <motion.a whileHover={{zIndex: 10, scale: 1.05}} style={{zIndex: 4-props.index}} className="block max-w-full" href={props.href}>
        <canvas className={`border border-gray-300 rounded-xl ${props.className}`} ref={props.canvas[props.index]}/>
    </motion.a>
}

export default MyPdfViewer;