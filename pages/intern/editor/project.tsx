import {Collections} from 'cockpit-sdk';
import React, {useEffect, useState} from 'react';
import Site from '../../../components/Site';
import Link from "next/link";
import {fetchJson} from "../../../util/fetch-util";
import {useUserStore} from "../../../util/use-user-store";
import {useRouter} from "next/router";
import {InternButton} from "../../../components/InternButton";
import Button from "../../../components/Button";

export default function Index() {

    const [articles, setArticles] = useState<Collections['paper_articles'][]>();
    const jwt = useUserStore(state => state.jwt)
    const {query: {projectId}} = useRouter();
    useEffect(() => {
        if (jwt === undefined) return;
        fetchJson("/api/editor/project", {jwt, json: {projectId}}).then(projects => setArticles(projects));
    }, [projectId, jwt])

    return <Site title="Projekte der Redaktionen">
        <div className="flex mb-4">
            <Link href="."><Button label="Zurück" secondary={true}/></Link>
        </div>
        <table className="table-auto border-collapse">
            <tbody>
            {articles?.map(article => <tr className="border-b border-black/10 md:text-lg">
                <td className="font-bold p-2">
                    <a href={`article?articleId=${article._id}`}
                       key={article._id} className="flex items-center space-x-2">
                        <div className={`w-4 h-4 shrink-0 rounded ${{
                            'finished': 'bg-black',
                            'corrected': 'bg-green-700',
                            'written': 'bg-green-300',
                            'writing': 'bg-yellow-400'
                        }[article.status]}`}/>
                        <div>{article.name}</div>
                        </a></td>
                <td>{article.author}</td>
                <td>{article.char_min} - {article.char_max}<span className="hidden md:inline"> Zeichen</span></td>
            </tr>)}
            </tbody>
        </table>
    </Site>
}