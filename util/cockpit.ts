import {CollectionGetProps, CollectionResponse, Collections} from "cockpit-sdk";
import {cockpit} from "./cockpit-sdk";
import {unstable_cache} from "next/cache";

export const Cockpit = {
  InternalId: {
    CalendarCache: '61b335996165305292000383',
    ReaderData: "637b85bc376231d51500018d",
    InstagramCache: "64956068666237420d000118"
  },
  collectionGet: <T extends keyof Collections>(collectionName: T, props?: CollectionGetProps<T>): Promise<CollectionResponse<Collections[T]>> => {
    console.log(`GET ${collectionName} ${JSON.stringify(props)}`)
    return unstable_cache(() => cockpit.collectionGet(collectionName, props),
        ["cockpit", collectionName, JSON.stringify(props)], {revalidate: 3600})()
  },
  collectionSave: <T extends keyof Collections>(collectionName: T, object: Partial<Collections[T]>): Promise<Collections[T]> => {
    console.log(`SAVE ${collectionName} `)
    return unstable_cache(() => cockpit.collectionSave(collectionName, object),
        ["cockpit", collectionName, JSON.stringify(object)], {revalidate: 3600})()
  }
}
