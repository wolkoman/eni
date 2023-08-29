"use client"
import {Collections} from 'cockpit-sdk';
import React, {useEffect, useState} from 'react';
import Site from '../../../../components/Site';
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import Button from "../../../../components/Button";
import {EniLoading} from "../../../../components/Loading";
import {usePermission} from "../../../(shared)/UsePermission";
import {Permission} from "../../../(domain)/users/Permission";
import {fetchJson} from "../../../(shared)/FetchJson";
import {Links} from "../../../(shared)/Links";

export function EditorProjectPage() {

    const [project, setProject] = useState<{articles: Collections['paper_articles'][], name: string}>();
    const searchParams = useSearchParams();
    usePermission([Permission.Editor]);
    useEffect(() => {
        fetchJson(Links.ApiEditorProject, {json: {projectId: searchParams.get('projectId')}}).then(projects => setProject(projects));
    }, [searchParams])

    return <Site title={`Projekt ${project?.name ?? ''}`} showTitle={true}>
        <div className="flex mb-4">
            <Link href="."><Button label="Zurück"/></Link>
        </div>
        {!project && <EniLoading/>}
        <table className="table-auto border-collapse">
            <tbody>
            {project?.articles.sort((a,b) => a.name.localeCompare(b.name)).map(article => <tr className="border-b border-black/10 md:text-lg">
                <td className="font-bold p-2">
                    <Link href={`article?articleId=${article._id}`}
                          key={article._id} className="">
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <div className={`w-4 h-4 shrink-0 rounded ${{
                                'finished': 'bg-black',
                                'corrected': 'bg-green-700',
                                'written': 'bg-green-300',
                                'writing': 'bg-yellow-400'
                            }[article.status]}`}/>
                            <div>{article.name}</div>
                        </div>
                    </Link></td>
                <td>{article.author}</td>
                <td>{article.char_min} - {article.char_max}<span className="hidden md:inline"> Zeichen</span></td>
            </tr>)}
            </tbody>
        </table>
    </Site>
}
