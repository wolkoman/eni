import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {cockpit} from "../../../util/cockpit-sdk";

const READER_ID = "637b85bc376231d51500018d";

export type ReaderData = Record<string, {liturgy: string, reader1: string, reader2: string}>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined ||!user.permissions[Permission.Admin]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  const readerData: ReaderData = await cockpit.collectionGet("internal-data", {filter: {_id: READER_ID}}).then(x => x.entries[0].data);
  const readers = await cockpit.collectionGet("person").then(x => x.entries
      .filter(person => person.competences?.includes('reader'))
      .map(person => ({_id: person._id, name: person.name}))
  );

  res.json({readerData, readers});

}
