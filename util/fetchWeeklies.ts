import {cockpit} from "./cockpit-sdk";
import {site} from "./sites";

export async function fetchWeeklies(){
    const articles = await cockpit.collectionGet('weekly', {sort:{'date': '-1'}});
    return articles.entries;
}

export async function fetchEmmausbote(){
    const articles = await cockpit.collectionGet('Emmausbote', {sort:{'date': '-1'}});
    return articles.entries;
}