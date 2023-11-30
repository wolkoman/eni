"use client"
import React, {useEffect, useState} from "react";
import {loadScannedDocuments} from "./loadScannedDocuments";
import Link from "next/link";

export function ScansPage() {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([] as { filename: string, last_modified: string, path: string }[])

  useEffect(() => load(), [])

  function load(){
    if(loading) return
    setLoading(true)
    loadScannedDocuments().then(files => {
      setFiles(files)
      setLoading(false)
    })
  }

  return <div>
    {files.map(file => <Link href={file.path}><div key={file.filename} className="py-1">
      {file.filename}
    </div></Link>)}
  </div>;
}