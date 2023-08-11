import {ScansPage} from "./ScansPage";
import Site from "../../../components/Site";
import React from "react";

export default async function Page() {
  return <Site title="Gescannte Dokumente" showTitle={true}>
    <ScansPage/>
  </Site>
}