import React, {useState} from "react";
import {SelfServiceFile, SelfServiceFileUpload} from "../../../../components/SelfService";
import {toast} from "react-toastify";
import {fetchJson} from "../../../(shared)/FetchJson";
import {Links} from "../../../(shared)/Links";
import Button from "../../../../components/Button";
import {Modal} from "./Modal";

export function MediaModal(props: { close: (files: string[]) => void, files: string[], articleId: string }) {
  const mediaModalForm = useState({
    files: props.files.map((file, index) => ({
      result: file,
      finished: true,
      name: file.split("/").reverse()[0].substring(14),
      id: file,
      index
    })) as SelfServiceFile[]
  });
  const [saving, setSaving] = useState(false);
  const uploading = mediaModalForm[0].files.some(file => !file.finished);

  function closes() {
    setSaving(true);
    const files = mediaModalForm[0].files.map(({result}) => result);
    toast.promise(fetchJson(Links.ApiEditorSaveMedia + props.articleId, {json: files}), {
      pending: "Speichere Medien..",
      success: "Medien gespeichert",
      error: "Fehler beim Speichern"
    })
      .then(() => props.close(files));
  }

  return <Modal>
    <div className="flex flex-col gap-2 max-w-screen w-80">
      <SelfServiceFileUpload name="files" form={mediaModalForm}/>
      <Button label="Schließen" secondary={true} onClick={closes}
              disabled={uploading || saving}/>
    </div>
  </Modal>;
}