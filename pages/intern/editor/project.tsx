import {Collections} from 'cockpit-sdk';
import React, {useEffect, useState} from 'react';
import Site from '../../../components/Site';
import Link from "next/link";
import {fetchJson} from "../../../util/fetch-util";
import {useUserStore} from "../../../util/use-user-store";
import {useRouter} from "next/router";
import {InternButton} from "../../../components/InternButton";

export default function Index() {

    const [articles, setArticles] = useState<Collections['paper_articles'][]>();
    const jwt = useUserStore(state => state.jwt)
    const {query: {projectId}} = useRouter();
    useEffect(() => {
        if (jwt === undefined) return;
        fetchJson("/api/editor/project", {jwt, json: {projectId}}).then(projects => setArticles(projects));
    }, [projectId, jwt])

    return <Site title="Projekte der Redaktionen">
        <div className="flex">
            <Link href=".">
                <div className="m-2 cursor-pointer bg-black/5 px-3 py-1 rounded">Zurück</div>
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 m-2">
            {articles?.map(article => <InternButton href={`article?articleId=${article._id}`} key={article._id}>
                <div className="text-2xl font-bold line-clamp-1 mx-4">
                    <div className={`inline-block w-4 h-4 rounded ${{
                        'finished': 'bg-black',
                        'corrected': 'bg-green-700',
                        'written': 'bg-green-300',
                        'writing': 'bg-yellow-400'
                    }[article.status]}`}/>
                    {article.name}</div>
                <div className="text-lg line-clamp-1">{article.author}</div>
                <div className="text-lg line-clamp-1">{article.char_min} - {article.char_max} Zeichen</div>
            </InternButton>)}

        </div>
    </Site>
}