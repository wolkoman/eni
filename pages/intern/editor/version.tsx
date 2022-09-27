import {Collections} from 'cockpit-sdk';
import React, {useState} from 'react';
import Site from '../../../components/Site';
import {cockpit} from "../../../util/cockpit-sdk";

export default function Version(props: { versions: Collections['paper_texts'][] }) {
    const [open, setOpen] = useState<string>();
    return <Site>
        {props.versions.map(version => <div key={version._id} className="border border-black/1 p-4 cursor-pointer mb-4" onClick={() => setOpen(version._id)}>
            <div>{new Date(version._created*1000).toLocaleString()}</div>
            {open === version._id && <pre>{version.text}</pre>}
        </div>)}
    </Site>
}

export async function getServerSideProps(context: any) {
    const versions = (await cockpit.collectionGet('paper_texts', {filter: {article: context.query.articleId}, sort: {_created: -1}})).entries;
    return versions ? {
        props: {versions}
    } : {
        notFound: true
    }
}