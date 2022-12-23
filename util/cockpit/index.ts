import fetch from "node-fetch";
import {Cockpit2Collection, Cockpit2Types} from "./types";

class NewCockpit {

    constructor(private apiKey: string, private base: string) {
    }

    fetch(url: string) {
        return fetch(this.base + url, {
            headers: {"api-key": this.apiKey}
        }).then(response => response.json());
    }

    getCollection<Type extends Cockpit2Collection>(model: Type, options?: { filter?: any, sort?: any, limit?: number }) {
        return this.fetch("/content/items/" + model + "?" + [
            options?.filter && "filter=" + JSON.stringify(options.filter),
            options?.sort && "sort=" + JSON.stringify(options.sort),
            options?.limit && "limit=" + options.limit,
        ]
            .filter(value => value)
            .join("&")) as Promise<Cockpit2Types[Type][]>;
    }

    getTypeDefinitions(models: Cockpit2Collection[]) {
        return Promise.all(models.map(async model => {
            const items = await this.getCollection(model, {limit: 1});
            if (items.length === 0) {
                console.log(`Model ${model} has no entry`);
                return {model, types: {}};
            }
            return {
                model,
                types: Object.fromEntries(Object.entries(items.at(0)!).map(([key, value]) => {
                    if(typeof value === 'number') return [key, "number"];
                    if(typeof value === 'string') return [key, "string"];
                    if(typeof value === 'object' && 'path' in (value as any)) return [key, "File"];
                    return [key,"unknown"];
                }))
            }

        }))
    }

}

export const Cockpit2 = new NewCockpit(
    process.env.COCKPIT2_TOKEN as string,
    "https://data.eni.wien/2"
);