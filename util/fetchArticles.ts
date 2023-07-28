import {site} from "./sites";
import {CockpitData} from "./cockpit-data";

export async function fetchArticles(){
    const articles = await CockpitData.collectionGet('article', {filter: {'platform': site('eni','emmaus')}, sort:{'_created': '-1'}});
    return articles.entries;
}