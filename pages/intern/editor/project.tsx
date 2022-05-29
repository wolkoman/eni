import {Collections} from 'cockpit-sdk';
import React, {useEffect, useState} from 'react';
import Site from '../../../components/Site';
import Link from "next/link";
import {fetchJson} from "../../../util/fetch-util";
import {useUserStore} from "../../../util/use-user-store";
import {useRouter} from "next/router";

export default function Index() {

  const [articles, setArticles] = useState<Collections['paper_articles'][]>();
  const jwt = useUserStore(state => state.jwt)
  const {query: {projectId}} = useRouter();
  useEffect(() => {
    if(jwt === undefined) return;
    fetchJson("/api/editor/project", {jwt, json:{projectId}}).then(projects => setArticles(projects));
  },[projectId, jwt])

  return <Site title="Projekte der Redaktionen">
    <div className="flex">
      <Link href="."><div className="m-2 cursor-pointer bg-black/5 px-3 py-1 rounded">Zurück</div></Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 m-2">
      {articles?.map(article => <Link href={`article?articleId=${article._id}`} key={article._id}>
        <div className="rounded-xl shadow border border-black/10 h-32 flex flex-col justify-center p-6 hover:bg-black/[3%] cursor-pointer">
          <div className="text-2xl">{article.name}</div>
          <div className="">{article.author}</div>
          <div className="">{article.char_min} - {article.char_max} Zeichen</div>
        </div></Link>)}

    </div>
  </Site>
}