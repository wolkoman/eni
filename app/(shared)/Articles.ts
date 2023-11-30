import {Cockpit} from "../../util/cockpit";
import {site} from "./Instance";

export async function fetchArticles() {
    const articles = await Cockpit.collectionGetCached('article', {
        filter: {'platform': site('eni', 'emmaus')},
        sort: {'_created': '-1'}
    });
    return articles.entries;
}
