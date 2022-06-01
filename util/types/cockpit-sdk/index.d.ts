//import {Credentials} from 'googleapis';

declare module 'cockpit-sdk' {

  type Object = { _id: string, _created: number }
  export type Collections = {
    'internal-data': { data: Credentials, id: string } & Object,
    'weekly': {
      date: string,
      emmaus: string,
      inzersdorf: string,
      neustift: string,
      neustift: string,
      preview: { path: string },
    } & Object,
    'site': {
      name: string,
      slug: string,
      layout: {component: string, settings: {text: string}}[]
      children: Collections['site'][],
      level: number
    } & Object,
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
      layout: {component: string, settings: {text: string}}[],
    } & Object,
    'person': {
      active: boolean,
      name: string,
      username: string,
      parish: 'emmaus' | 'inzersdorf' | 'neustift' | 'all',
      competences: ('organ' | 'calendar' | 'admin')[],
      code?: string,
      email?: string,
    } & Object,
    paper_texts: {
      article: Reference,
      text: string
    } & Object,
    paper_projects: {
      name: string,
      guideline_link: string,
      deadline: string
    } & Object,
    paper_articles: {
      name: string,
      project: Reference,
      author: string,
      email: string,
      char_min: string,
      char_max: string
      status: 'finished' | 'corrected' | 'written' | 'writing'
    } & Object,
  }
  type Reference = {
    _id: string,
    link: string,
    display: string
  }
  type Singletons = {
    impressum: { content: string } & Object
  }
  type CollectionResponse<T> = {
    entries: T[]
  }

  export type User = {
    _id: string;
    group: '' | 'PrivateCalendarAccess' | 'OrganAccess' | 'admin',
    user: string,
    api_key: string,
    name: string,
    email: string,
    active: boolean,
    permissions: Record<string, boolean>,
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