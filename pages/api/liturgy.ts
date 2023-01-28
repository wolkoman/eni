import {NextApiRequest, NextApiResponse} from 'next';
import {XMLParser} from "fast-xml-parser";
import {Permission, resolveUserFromRequest} from "../../util/verify";
import {cockpit} from "../../util/cockpit-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

  const user = resolveUserFromRequest(req);
  if (user === undefined || !user?.permissions[Permission.Admin]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  res.json(await getLiturgyData());

}
export type LiturgyData = Record<string, Liturgy[]>;
export interface Liturgy{
  name: string;
  color: string;
  rank: string;
  reading1: string;
  reading2: string;
  psalm: string;
  evangelium: string;
}
export async function getLiturgyData(): Promise<LiturgyData>{

  const year = new Date().getFullYear()+1;
  /*const xml = await fetch(`https://www.eucharistiefeier.de/lk/api.php?jahr=${year}`)
      .then(response => response.text())
      .then(response => response.replace(/<br>/g, ""))
      .then(response => new XMLParser({alwaysCreateTextNode: true}).parse(response).html.head.body.table.tbody.tr);

  const merged: LiturgyData = Object.fromEntries(xml.reduce((data: any, {td}: { td: Cell }) => isNewDate(td)
          ? [...data, {date: transformDate(td[0] as TextNode), liturgies: transformLiturgy(td.slice(1))}]
          : [...data.slice(0, -1), {...data.at(-1), liturgies: [...data.at(-1)!.liturgies, ...transformLiturgy(td)]}]
      , []).map(({date, liturgies}: any) => [date, liturgies]));
   */

  const liturgyCache = (await cockpit.collectionGet("internal-data", {filter: {id: 'liturgy'}})).entries[0];
  //await cockpit.collectionSave("internal-data", {...liturgyCache, data: {...liturgyCache.data, ...merged}});

  return {/*...merged,*/ ...liturgyCache.data};

}

export async function getLiturgyDataTill(until: Date): Promise<LiturgyData>{
  return getLiturgyData().then(data => Object.fromEntries(Object.entries(data).filter(([date]) =>
      new Date(date).getTime() > new Date().getTime() - 1000*3600*24
      && new Date(date) < until))) ;

}


interface TextNode { '#text': string }
type SpanNode = {span: (TextNode | TextNode[])}
type Cell = (SpanNode | TextNode)[]

function isNewDate(td: any){
  return !td[0]?.span;
}
function transformDate(date: TextNode){
  return date['#text'].split(".").reverse().join("-");
}
function transformLiturgy(td: Cell): Liturgy[]{
  return [td.map(cell => 'span' in cell
    ? (
      Array.isArray(cell.span)
        ? cell.span.map(text => text['#text']).join(", ")
        : cell.span["#text"]
    ) : cell["#text"]
  )].map(texts => ({
    name: texts[0],
    rank: texts[1],
    color: texts[2],
    reading1: texts[3],
    reading2: texts[5],
    psalm: texts[4],
    evangelium: texts[6],
  }));
}