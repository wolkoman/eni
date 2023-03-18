import {cockpit} from "./cockpit-sdk";

async function getCachedPrompt(prompt: string): Promise<string>{

    const cache = await cockpit.collectionGet("cache", {filter: {key: prompt}})
        .then(({entries}) => entries)

    if(cache.length > 0) return cache[0].value;

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

    await cockpit.collectionSave("cache", {key: prompt, value: value});
    return value;

}

function trimString(value: string){
    const trimable = "\" .\n";
    const start = value.split("").findIndex(c => trimable.indexOf(c) === -1);
    const end = value.split("").reverse().findIndex(c => trimable.indexOf(c) === -1);
    return value.substring(start, value.length - end);
}

export async function getInstagramTitle(description: string){
    const value = await getCachedPrompt("Formuliere einen sehr kurzen Titel: " + description);
    return trimString(value);
}