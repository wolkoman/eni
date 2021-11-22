export class CockpitCollectionBuilder {
  entries: any[] = [];

  withEntry(content: any) {
    this.entries.push({
      ...content,
      _id: `${Math.random().toString().substring(2)}`
    });
    return this;
  }

  build() {
    return {entries: this.entries};
  }
}

export class CockpitArticleBuilder {
  article = {
    title: 'Neue Homepage unserer Pfarren',
    preview_image: {path: 'https://picsum.photos/id/888/300/300.jpg'},
    author: 'Homepage',
    content: 'Der synodale Prozess, den Papst Franziskus der Weltkirche verordnet hat und der unlängst in allen Diözesen gleichzeitig gestartet wurde, stellt nichts Geringeres als einen „Paradigmenwechsel" der Kirche in ihrem Selbst- und Weltverständnis dar: Das hat der Wiener Pastoraltheologe Prof. Johann Pock in einem Gastbeitrag in der Wochenzeitung „Die Furche" (aktuelle Ausgabe) betont.',
    resort: 'DIGITAL',
    external_url: 'https://www.vaticannews.va/de/kirche/news/2021-10/oesterreich-synodaler-prozess-laut-pock-paradigmenwechsel.html',
    external_image: 'https://www.vaticannews.va//content/dam/vaticannews/images-multimedia/sinodo/Sinodo_vescovi_famiglia_2014.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.1500.844.jpeg',
    slug: '-sterreich--synodaler-prozess-laut-pock--paradigmenwechsel-',
    platform: ['eni'],
    layout: null,
  };

  build(){
    return this.article;
  }
}