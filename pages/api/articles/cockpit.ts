import {NextApiRequest, NextApiResponse} from 'next';
import {cockpit} from '../../../util/cockpit-sdk';
import {loadVaticanImage} from './image';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  let data = JSON.parse(req.body);
  if (!data.item) {
    res.status(401).json({error: "missing item"});
    return;
  }

  const entry = await cockpit.collectionSave("article", {
    title: data.item.title.trim(),
    preview_image: {path: await loadVaticanImage(data.item.link)},
    author: "Vatican News - Deutsch",
    content: data.item.content.trim(),
    resort: "Weltkirche",
    external_url: data.item.link,
    external_image: await loadVaticanImage(data.item.link),
    slug: data.item.title.trim().toLowerCase().replace(/[^[a-z]/g, "-"),
    platform: ["eni"]
  })
  res.status(200).json({entry, link: `http://data.eni.wien/collections/entry/article/${entry?._id}`});
}