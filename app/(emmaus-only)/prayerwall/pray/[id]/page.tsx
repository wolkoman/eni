import {fetchPrayer} from "../../prayer.server";
import Site from "../../../../../components/Site";
import {DisplayField} from "../../../../../components/SelfService";

export default async function Prayer({params}: { params: {id: string} }){
  const prayer = await fetchPrayer(params.id)
  return <Site>
    <div className="my-4">
      <DisplayField label="Anliegen">
        {prayer.concern}
      </DisplayField>
      <DisplayField label="Gebetsvorschlag">
        {prayer.suggestion}
      </DisplayField>
    </div>
  </Site>
}
