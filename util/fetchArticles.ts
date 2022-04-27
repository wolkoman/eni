import {cockpit} from "./cockpit-sdk";
import {site} from "./sites";

export async function fetchArticles(){
    const articles = await cockpit.collectionGet('article', {filter: {'platform': site('eni','emmaus')}, sort:{'_created': '-1'}});
    return articles.entries;
}