import {Cockpit} from "@/util/cockpit";
import {Collections} from "cockpit-sdk";

export async function fetchEmmausSites() {
    const {entries: articles} = await Cockpit.collectionGet('site');
    const main = articles?.find(article => article.name == "emmaus.wien")!;

    function getChildren(site: Collections['site'], level = 0, parent?: Collections['site']): Collections['site'][] {
        return [
            ...site.children.map(child => ({...child, level, parent: parent ?? null})),
            ...site.children.flatMap(child => getChildren(child, level + 1, {...child, children: []}))
        ];
    }

    return main ? getChildren(main) : [];
}
