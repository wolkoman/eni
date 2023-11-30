import React from "react";
import {getLiturgyData} from "../../../../pages/api/liturgy";
import {MyPage} from "./MyPage";

const revalidate = 3600 * 24;

export default async function HomePage() {
  const liturgy = await getLiturgyData();
  return <MyPage liturgy={liturgy}/>
}
