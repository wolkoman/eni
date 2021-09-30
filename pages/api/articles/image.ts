import {NextApiRequest, NextApiResponse} from 'next';

export async function loadVaticanImage(link: string) {
  let text = await fetch(link).then(response => response.text());
  const regex = /<figure class="article__image".*?[ \n\r]*<picture>[ \n\r]*<source.*?data-original-set="([^ ]*)/;
  return `https://www.vaticannews.va/${text.match(regex)?.reverse()[0]}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  let data = JSON.parse(req.body);
  if(!data.link){
    res.status(401).json({error: "missing link"});
    return;
  }

  const image = await loadVaticanImage(`https://www.vaticannews.va/${data.link}`);
  res.status(200).json({image});
}