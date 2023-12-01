import {ScansPage} from "./ScansPage";
import Site from "../../../components/Site";

export default async function Page() {
  return <Site title="Gescannte Dokumente" showTitle={true}>
    <ScansPage/>
  </Site>
}