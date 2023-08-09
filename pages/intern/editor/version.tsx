import {Collections} from 'cockpit-sdk';
import {AnimatePresence, motion} from 'framer-motion';
import React, {useState} from 'react';
import Site from '../../../components/Site';
import {Cockpit} from "@/util/cockpit";

export default function Version(props: { versions: Collections['paper_texts'][] }) {
    const [open, setOpen] = useState<string>();
    return <Site title="Versionen">
        <div className="flex flex-col gap-4">
        {props.versions.map(version => <motion.div
            key={version._id}
            className={`border border-black/20 rounded px-4 py-2  ${open !== version._id && 'cursor-pointer'}`}
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

export async function getServerSideProps(context: any) {
    const versions = (await Cockpit.collectionGet('paper_texts', {
        filter: {article: context.query.articleId},
        sort: {_created: -1}
    })).entries;
    return versions ? {
        props: {versions}
    } : {
        notFound: true
    }
}
