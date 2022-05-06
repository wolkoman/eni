import {cockpit} from "./cockpit-sdk";
import {Collections} from "cockpit-sdk";

export async function fetchEmmausSites() {
    const {entries: articles} = await cockpit.collectionGet('site');
    const main = articles.find(article => article.name == "emmaus.wien")!;
    function getChildren(site: Collections['site'], level = 0): Collections['site'][] {
        return [...site.children.map(child => ({...child, level})), ...site.children.flatMap(child => getChildren(child, level+1))];
    }
    return getChildren(main);
}