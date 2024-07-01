import {WeeklyEditorStoreData} from "@/app/intern/wochenmitteilungen-editor/store";
import React from "react";
import {ItemComponent} from "@/app/intern/wochenmitteilungen-editor/(announcements)/ItemComponent";

export function WeeklyContent(props: {
  storeData: WeeklyEditorStoreData,
}) {
  return <>
    <div className="print:hidden lg:columns-2 gap-6">
      {props.storeData.items
        .map(item => <div key={item.id} className="mb-6">
          <ItemComponent item={item} storeData={props.storeData} isWebview={true}/>
        </div>)}
    </div>
  </>;
}
