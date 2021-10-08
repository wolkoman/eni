//import {Credentials} from 'googleapis';

declare module 'cockpit-sdk' {

  type Object = { _id: string, _created: number }
  export type Collections = {
    'internal-data': { data: Credentials } & Object
    'article': {
      title: string,
      preview_image: { path: string },
      author: string,
      content: string,
      resort: string,
      external_url: string,
      external_image: string,
      slug: string,
      platform: string[] | string,
      layout: {component: string, settings: {text: string}}[]
    } & Object,
    'person': {
      active: boolean,
      name: string,
      username: string,
      parish: 'emmaus' | 'inzersdorf' | 'neustift' | 'all' | 'extern',
      competences: ('organ')[],
      code: string
    } & Object,
  }
  type Singletons = {
    'impressum': { content: string } & Object
  }
  type CollectionResponse<T> = {
    entries: T[]
  }

  export type User = {
    _id: string;
    group: '' | 'PrivateCalendarAccess' | 'OrganAccess' | 'admin',
    api_key: string,
    name: string,
    active: boolean
  }
  type Error = {
    message: string
  }

  type CollectionGetProps<T> = { filter?: Partial<Collections[T]>, sort?: Partial<Record<keyof Collections[T]>, '1' | '-1'> }

  class CockpitSDK {
    public host: string;

    constructor(props: { host: string, accessToken?: string })

    collectionGet<T extends keyof Collections>(collectionName: T, props?: CollectionGetProps<T>): Promise<CollectionResponse<Collections[T]>>

    collectionSave<T extends keyof Collections>(collectionName: T, object: Optional<Collections[T], '_id'>)
    collectionSave<T extends keyof Collections>(collectionName: T, object: Collections[T])

    singletonGet<T extends keyof Singletons>(singletonName: T): Promise<Singletons[T]>

    authUser(username: string, password: string): Promise<User | Error>

    listUsers(): Promise<User[]>
  }

  export = CockpitSDK;
}