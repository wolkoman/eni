import {Cockpit} from "../../util/cockpit";

export async function fetchArticles() {
    const articles = await Cockpit.collectionGetCached('article', {
        filter: {'platform': "emmaus"},
        sort: {'_created': '-1'}
    });
    return articles.entries;
}
