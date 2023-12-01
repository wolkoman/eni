import {CollectionGetProps, CollectionResponse, Collections} from "cockpit-sdk";
import {cockpit} from "./cockpit-sdk";
import {revalidateTag, unstable_cache} from "next/cache";

export const Cockpit = {
    InternalId: {
        CalendarCache: '61b335996165305292000383',
        ReaderData: "637b85bc376231d51500018d",
        InstagramCache: "64956068666237420d000118"
    },
    collectionGet: <T extends keyof Collections>(collectionName: T, props?: CollectionGetProps<T>): Promise<CollectionResponse<Collections[T]>> => {
        console.log(`GET ${collectionName} ${JSON.stringify(props)}`)
        return cockpit.collectionGet(collectionName, props)
    },
    collectionGetCached: <T extends keyof Collections>(collectionName: T, props?: CollectionGetProps<T>): Promise<CollectionResponse<Collections[T]>> => {
        console.log(`CACHEGET ${collectionName} ${JSON.stringify(props)}`)
        return unstable_cache(() => {
                console.log(`GET ${collectionName} ${JSON.stringify(props)}`)
                return cockpit.collectionGet(collectionName, props)
            },
            ["cockpit", collectionName, JSON.stringify(props)], {
                revalidate: 300,
                tags: [`cockpit-${collectionName}`]
            })()
    },
    collectionSave: <T extends keyof Collections>(collectionName: T, object: Partial<Collections[T]>): Promise<Collections[T]> => {
        console.log(`SAVE ${collectionName} `)
        revalidateTag(`cockpit-${collectionName}`)
        return cockpit.collectionSave(collectionName, object)
    }
}
