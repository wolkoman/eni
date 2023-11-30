import React from "react";
import {Cockpit} from "../../../../util/cockpit";
import {EditorArticlePage} from "./EditorArticlePage";
import {notFound} from "next/navigation";

export default async function HomePage({searchParams}: { searchParams: { articleId: any }}) {
    const article = (await Cockpit.collectionGet('paper_articles', {filter: {_id: searchParams.articleId}})).entries[0];
    const project = (await Cockpit.collectionGet('paper_projects', {filter: {_id: article.project._id}})).entries[0];
    const versions = (await Cockpit.collectionGet('paper_texts', {
        filter: {article: searchParams.articleId},
        sort: {_created: -1}
    })).entries/*.entries
        .map((entry, index) => index === 0 ? entry : {_id: entry._id, _created: entry._created})*/;

    if (!article) notFound()
    return <EditorArticlePage article={article} versions={versions} project={project}/>
}
