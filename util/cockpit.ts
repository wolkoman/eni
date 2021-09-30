const token = '64198f6f1e227b537244360e04f08f';
export const cockpitBase = 'https://data.eni.wien';

export type CockpitArticle = { _id: string, _created: number, resort: string, title: string, author: string, preview_image: { path: string }, content: string, layout: { component: string, settings: any }[], external_url: string };
export type CockpitArticles = CockpitArticle[];

export class Cockpit {
  static article(filter = {}, sort = {}): Promise<CockpitArticles> {
    return Cockpit.collection('article', Object.fromEntries
      ([
          ...(Object.entries(filter).map(([key, value]) => [`filter[${key}]`, value])),
          ...(Object.entries(sort).map(([key, value]) => [`sort[${key}]`, value]))
        ])
    );
  }

  static collection(collectionName: string, params = {}) {
    return Cockpit.fetch(`collections/get/${collectionName}`, params);
  }

  static fetch(url: string, params: Record<string, string>) {
    return fetch(`${cockpitBase}/api/${url}?${Object.entries({
      ...params,
      token
    }).map(([key, value]) => `${key}=${value}`).join('&')}`)
      .then(response => response.json())
      .then(response => response.entries);
  }
}