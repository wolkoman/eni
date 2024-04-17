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

export function getEvangeliumSummary(evangelium: any){
    return getCachedPrompt("Fasse das Evangelium in einem Satz zusammen. Beginne mit 'Im Evangelium...':" + JSON.stringify(evangelium));
}

export function getWeeklySummary(items: any){
    return getCachedPrompt("Formuliere ein kurzes sachliches Intro für die Wochenmitteilungen. Keine Anrede oder Schluss.\n\n Wochenmitteilungen:" + JSON.stringify(items));
}
