import React, { useEffect, useState } from "react";
import Radium from "radium";
import { style } from "../util/style";
import Loader from "../Graphic/Loader";

interface Article {
  title: string;
  content: string;
  layout?: (TextSection)[]
  author?: string
}
interface TextSection {
  component: "text";
  settings: {text: string}
}
const Article = Radium(({ article }: { article: () => Promise<Article> }) => {
  const [object, setObject] = useState<Article>();
  const [error, setError] = useState(false);
  useEffect(() => {
    article().then(setObject).catch(() => setError(true));
  }, [article]);

  return (
    <div style={{ padding: style.padding }}>
      {error ? <div style={{fontStyle: "italic"}}>Dieser Artikel existiert nicht.</div> : object ? (
        <div>
          <div
            style={{
            borderBottom: "1px solid #ddd", }}
            key="title"
          >
            <h1
              style={{
                ...style.serif,
                marginTop: 0,
              }}
            >
              {object.title}
            </h1>
              { object.author ? <div style={{marginBottom: 20, ...style.serif, fontStyle: "italic"}}>von {object.author}</div> : null}
          </div>
          { object.layout ? object.layout.map((l,index) => <div
            key={index}
            style={{ overflowWrap: "break-word", lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{__html: l.settings.text}}
        />) : <div
            key="content"
            style={{ overflowWrap: "break-word", lineHeight: 1.5 }}
            dangerouslySetInnerHTML={{ __html: object.content }}
          ></div>}
          </div>
      ) : (
        <Loader></Loader>
      )}
    </div>
  );
});

export default Article;
