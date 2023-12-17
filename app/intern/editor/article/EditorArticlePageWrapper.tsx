"use client"

import {useEffect, useState} from "react";
import {fetchArticleData} from "./fetchArticleData";
import {EditorArticlePage} from "./EditorArticlePage";
import {EniLoading} from "../../../../components/Loading";

export function EditorArticlePageWrapper(props: { articleId: string }) {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchArticleData>>>();

  useEffect(() => {
    fetchArticleData(props.articleId).then(data => setData(data));
  }, []);

  return data
    ? <EditorArticlePage article={data.article} versions={data.versions} project={data.project}/>
    : <EniLoading/>;
}