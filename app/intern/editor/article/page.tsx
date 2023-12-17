import {notFound} from "next/navigation";
import {fetchArticleData} from "./fetchArticleData";
import {EditorArticlePageWrapper} from "./EditorArticlePageWrapper";

export default async function HomePage({searchParams}: { searchParams: { articleId: any }}) {
    const {article, project, versions} = await fetchArticleData(searchParams.articleId);

    if (!article) notFound()
    return <EditorArticlePageWrapper articleId={searchParams.articleId}/>
}
