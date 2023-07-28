import {getCockpitResourceUrl} from "../components/Articles";
import {Collections} from "cockpit-sdk";
import {CockpitData} from "./cockpit-data";

export async function fetchWeeklies(){
    const articles = await CockpitData.collectionGet('weekly', {sort:{'date': '-1'}});
    return articles.entries;
}
export async function fetchCurrentWeeklies(){
    return fetchWeeklies().then(weeklies => weeklies[0]);
}

export async function fetchEmmausbote(){
    const articles = await CockpitData.collectionGet('Emmausbote', {sort:{'date': '-1'}});
    return articles.entries;
}

export function fetchWeeklyEdition(weeklyEntry: Collections['weekly'], parish: 'emmaus' | 'inzersdorf' | 'neustift') {
    return getCockpitResourceUrl(weeklyEntry![parish]);
}