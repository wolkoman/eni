import Site from "../../../../components/Site";
import {AddPrayerForm} from "./AddPrayerForm";
import {SectionHeader} from "../../../../components/SectionHeader";

export default async function AddPage() {

  return <Site title="Gebetswand">
    <div className="my-4">
      <SectionHeader>Gebetswand</SectionHeader>
      <AddPrayerForm/>
    </div>
  </Site>
}
