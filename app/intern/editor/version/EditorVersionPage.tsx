"use client"
import {Collections} from 'cockpit-sdk';
import {AnimatePresence, motion} from 'framer-motion';
import React, {useState} from 'react';
import Site from '../../../../components/Site';

export function EditorVersionPage(props: { versions: Collections['paper_texts'][] }) {
    const [open, setOpen] = useState<string>();
    return <Site title="Versionen">
        <div className="flex flex-col gap-4">
        {props.versions.map(version => <motion.div
            key={version._id}
            className={`border border-black/20 rounded px-4 py-2 ${open !== version._id && 'cursor-pointer'}`}
            onClick={() => setOpen(version._id)}
        >
            <div>{new Date(version._created * 1000).toLocaleString("de-AT")}</div>
            <AnimatePresence>{open === version._id && <motion.div
                initial={{height: 0}}
                exit={{height: 0}}
                animate={{height: "auto"}}
                className="whitespace-pre-wrap overflow-hidden mt-2">{version.text}</motion.div>}</AnimatePresence>
        </motion.div>)}
        </div>
    </Site>
}
