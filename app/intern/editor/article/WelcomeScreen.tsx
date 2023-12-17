import React from "react";

export function WelcomeScreen(props: { article: any, project: any }) {
  return <div className="py-12 max-w-lg mx-auto">
    <div className="font-bold text-5xl mb-4">Schreibmaske</div>
    <div className="text-xl">Artikel: <span
      className="bg-white px-2 py-1">{props.article.name}</span></div>
    <div className="text-xl">Autor:in: <span
      className="bg-white px-2 py-1">{props.article.author}</span></div>
    <div className="text-xl">Zeichen: <span
      className="bg-white px-2 py-1">{props.article.char_min}-{props.article.char_max} Zeichen</span>
    </div>
    <div className="text-xl">Redaktionsschluss: <span
      className="bg-white px-2 py-1">{new Date(props.project.deadline).toLocaleDateString()}</span>
    </div>
  </div>;
}