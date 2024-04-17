import {Cockpit} from "@/util/cockpit";

async function getCachedPrompt(prompt: string): Promise<string> {

    const cache = await Cockpit.collectionGetCached("cache", {filter: {key: prompt}})
        .then(({entries}) => entries)

    if (cache.length > 0) return cache[0].value;

    const value = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {Authorization: `Bearer ${process.env.OPENAI_TOKEN}`, "Content-Type": "application/json"},
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": prompt}]
        })
    })
        .then(response => response.json())
        .then(response => response.choices[0].message.content)

    await Cockpit.collectionSave("cache", {key: prompt, value: value});
    return value;

}

function trimString(value: string) {
    const trimable = "\" .\n";
    const start = value.split("").findIndex(c => trimable.indexOf(c) === -1);
    const end = value.split("").reverse().findIndex(c => trimable.indexOf(c) === -1);
    return value.substring(start, value.length - end);
}

export async function getInstagramTitle(description: string) {
    const value = await getCachedPrompt("Formuliere einen sehr kurzen Titel (max. 5 Wörter): " + description);
    return trimString(value);
}

export function getPrayerSuggestion(concern: string){
    return getCachedPrompt("Formuliere ein katholisches Gebet (max 10 Zeilen, keine Reime) für dieses aus der Sicht der Gemeinde: " + concern);
}

export function getWeeklySlogan(evangelium: any){
    return getCachedPrompt("Formuliere einen Slogan aus wenigen Worten (soll als Betreffzeile dienen, 3-4 Worte): " + JSON.stringify(evangelium)).then(trimString);
}
export function getEvangeliumSummary(items: any){
    return getCachedPrompt("Fasse die Verlautbarungen für die Pfarrgemeinde sehr kurz zusammen. Keine Listen, ganze Sätze. " + JSON.stringify(items));
}

export function getWeeklySummary(items: any){
    return getCachedPrompt("Fasse die Verlautbarungen für die Pfarrgemeinde kurz zusammen. Keine Listen, ganze Sätze. \n\n" + JSON.stringify(items));
}
