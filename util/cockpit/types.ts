interface CockpitObject {
    "_state": number,
    "_modified": number,
    "_mby": string,
    "_created": number,
    "_cby": string,
    "_id": string
}

interface CockpitFile {
    "path": string,
    "title": string,
    "mime": string,
    "type": string,
    "description": string,
    "tags": string[],
    "size": number,
    "colors": string[],
    "width": number,
    "height": number,
    "_hash": string,
    "_created": number,
    "_modified": number,
    "_cby": string,
    "folder": string,
    "_id": string
}
export type Cockpit2Collection = string & keyof Cockpit2Types;
export type Cockpit2Types = {
    emmausbote: CockpitObject & {
        date: string,
        file: CockpitFile,
        preview: CockpitFile,
    }
}