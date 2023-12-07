import {CollectionGetProps, CollectionResponse, Collections} from "cockpit-sdk";
import {cockpit} from "./cockpit-sdk";
import {revalidateTag, unstable_cache} from "next/cache";
import {notifyAdmin} from "@/app/(shared)/Telegram";

export const Cockpit = {
    InternalId: {
        CalendarCache: '61b335996165305292000383',
        ReaderData: "637b85bc376231d51500018d",
        InstagramCache: "64956068666237420d000118"
    },
    "collectionGet": <T extends keyof Collections>(collectionName: T, props?: CollectionGetProps<T>): Promise<CollectionResponse<Collections[T]>> => {
        console.log(`GET ${collectionName} ${JSON.stringify(props)}`)
        return cockpit.collectionGet(collectionName, props)
            .catch(async () => {
                await notifyAdmin("Cockpit get " + collectionName + "failed " + JSON.stringify(props));
                return {entries: []};
            })
    },
    collectionGetCached<T extends keyof Collections>(collectionName: T, props?: CollectionGetProps<T>): Promise<CollectionResponse<Collections[T]>> {
        console.log(`CACHEGET ${collectionName} ${JSON.stringify(props)}`)
        return unstable_cache(() => {
                console.log(`CACHEGET! ${collectionName} ${JSON.stringify(props)}`)
                return cockpit.collectionGet(collectionName, props)
                    .catch(async () => {
                        await notifyAdmin("Cockpit cacheGet " + collectionName + "failed " + JSON.stringify(props));
                        return {entries: []};
                    })
            },
            ["cockpit", collectionName, JSON.stringify(props)], {
                revalidate: 300,
                tags: [`cockpit-${collectionName}`]
            })()
    },
    collectionSave<T extends keyof Collections>(collectionName: T, object: Partial<Collections[T]>): Promise<Collections[T]> {
        console.log(`SAVE ${collectionName} `)
        revalidateTag(`cockpit-${collectionName}`)
        return cockpit.collectionSave(collectionName, object)
            .catch(async () => {
                await notifyAdmin("Cockpit cacheSave " + collectionName + "failed " + JSON.stringify(object));
                return {} as any;
            })
    }
}
