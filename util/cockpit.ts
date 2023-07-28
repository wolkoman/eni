import {CollectionGetProps, CollectionResponse, Collections} from "cockpit-sdk";
import {cockpit} from "./cockpit-sdk";

export const Cockpit = {
  collectionGet: <T extends keyof Collections>(collectionName: T, props?: CollectionGetProps<T>): Promise<CollectionResponse<Collections[T]>> => {
    console.log(`GET ${collectionName} ${JSON.stringify(props)}`)
    return cockpit.collectionGet(collectionName, props)
  },
  collectionSave: <T extends keyof Collections>(collectionName: T, object: Partial<Collections[T]>): Promise<Collections[T]> => {
    console.log(`SAVE ${collectionName} `)
    return cockpit.collectionSave(collectionName, object)
  }
}