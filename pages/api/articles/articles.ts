import {NextApiRequest, NextApiResponse} from 'next';
import Parser from 'rss-parser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const urls = {
    inzersdorf: "https://www.pfarresanktnikolaus.at/wp/?feed=rss2",
    vatican: "https://www.vaticannews.va/de.rss.xml",
  }

  // @ts-ignore
  const url = urls[req.query.type];
  if(url === undefined){
    res.status(400).end("unknown query 'type'");
    return;
  }

  let parser = new Parser();
  let feed = await parser.parseURL(url);

  res.status(200).json(feed);
}