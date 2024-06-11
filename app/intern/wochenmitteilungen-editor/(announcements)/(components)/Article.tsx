import {Article} from "@/app/intern/wochenmitteilungen-editor/store";
import React, {Dispatch, SetStateAction} from "react";
import {
  Field,
  SelfServiceEditor,
  SelfServiceImageSizeToggle,
  SelfServiceInput
} from "../../../../../components/SelfService";

export function ArticleComponent({item}: { item: Article }) {
  return <>
    <div className="flex justify-between my-3 items-end">
      <div className="font-semibold text-lg leading-tight">{item.title}</div>
      <div className="italic shrink-0 text-sm" dangerouslySetInnerHTML={{__html: item.author}}/>
    </div>
    <div className="" dangerouslySetInnerHTML={{__html: item.text}}/>
    {item.image && <div
        style={{backgroundImage: `url(${item.image})`, height: item.imageSize}}
        className="bg-contain bg-no-repeat bg-center my-4"/>
    }
  </>
}

export function WeeklyArticleEditor({form}: { form: [Article, Dispatch<SetStateAction<Article>>] }) {
  return <div className="grid grow">
    <Field label="Titel"><SelfServiceInput name="title" form={form}/></Field>
    <Field label="Autor:in"><SelfServiceInput name="author" form={form}/></Field>
    <Field label="Text"><SelfServiceEditor name="text" form={form}/></Field>
    <Field label="Bild">
      <div className="flex">
        <SelfServiceInput name="image" form={form}/>
        <SelfServiceImageSizeToggle name="imageSize" form={form}/>
      </div>
    </Field>
  </div>;
}
