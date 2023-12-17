import {Collections} from "cockpit-sdk";
import Button from "../../../../components/Button";
import Link from "next/link";
import {Links} from "../../../(shared)/Links";
import React, {ChangeEvent} from "react";

export function MoreOptions(props: {
  articleId: string,
  editable: any,
  onSave: () => Promise<void>,
  openMediaModel: () => any,
  saved: "saving" | "saved" | "justnow" | "error",
  permission: boolean,
  status: Collections['paper_articles']['status'],
  disabled: boolean,
  onSaveStatusChange: (status: Collections['paper_articles']['status']) => any,
  onFinish: () => void
}) {
  return <div className="flex gap-2 text-black/80">
    {props.editable && <Button
        label={<img src="/logo/icon_save.svg" className="w-5 mt-0.5"/>}
        onClick={props.onSave}
        disabled={props.saved === "saving" || props.saved === "saved"}/>
    }
    {props.editable && <Button
        label={<img src="/logo/icon_media.svg" className="w-5 mt-0.5"/>}
        onClick={() => props.openMediaModel}/>
    }
    {props.permission ? <>
      <Link href={Links.ProjektplattformVersion(props.articleId)} target="_blank">
        <Button label={<img src="/logo/icon_versions.svg" className="w-5 mt-0.5"/>}/>
      </Link>
      <select
        className="px-3 py-1 bg-black/5 rounded-lg cursor-pointer"
        value={props.status} disabled={props.disabled}
        onChange={(event: any) => props.onSaveStatusChange(event.target!.value as any)}>
        <option value="writing">In Arbeit</option>
        <option value="written">Geschrieben</option>
        <option value="corrected">Lektoriert</option>
        <option value="finished">Fertiggestellt</option>
      </select></> : props.editable && <Button label="Abgeben" onClick={props.onFinish}/>}
  </div>;
}