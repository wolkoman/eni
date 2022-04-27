import {cockpit} from "./cockpit-sdk";
import {site} from "./sites";

export async function fetchWeeklies(){
    const articles = await cockpit.collectionGet('weekly', {sort:{'date': '-1'}});
    return articles.entries;
}