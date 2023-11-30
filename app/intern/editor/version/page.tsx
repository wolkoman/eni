import React from "react";
import {EditorVersionPage} from "./EditorVersionPage";
import {Cockpit} from "../../../../util/cockpit";
import {notFound} from "next/navigation";

export default async function HomePage({searchParams}: { searchParams: { articleId: any } }) {
    if (!searchParams.articleId) notFound()
    const versions = (await Cockpit.collectionGet('paper_texts', {
        filter: {article: searchParams.articleId},
        sort: {_created: -1}
    })).entries;
    return <EditorVersionPage versions={versions}/>
}
