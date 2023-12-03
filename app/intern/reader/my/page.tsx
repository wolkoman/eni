import {loadCachedLiturgyData} from "../../../../pages/api/liturgy";
import {MyPage} from "./MyPage";

export default async function HomePage() {
  const liturgy = await loadCachedLiturgyData();
  return <MyPage liturgy={liturgy}/>
}
