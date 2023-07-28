import {site} from "./sites";
import {Cockpit} from "./cockpit";

export async function fetchArticles(){
    const articles = await Cockpit.collectionGet('article', {filter: {'platform': site('eni','emmaus')}, sort:{'_created': '-1'}});
    return articles.entries;
}