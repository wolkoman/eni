import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {cockpit} from "../../../util/cockpit-sdk";
import {ReaderData} from "./index";

const READER_ID = "637b85bc376231d51500018d";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const user = resolveUserFromRequest(req);

  if (user === undefined ||!user.permissions[Permission.Admin]) {
    res.status(401).json({errorMessage: 'No permission'});
    return;
  }

  const data: ReaderData = await cockpit.collectionGet("internal-data", {filter: {_id: READER_ID}}).then(x => x.entries[0].data);
  const updatedData = {...data, ...Object.fromEntries(Object.entries(req.body).map(([id, record]: [string, any]) => [id, {...(data[id] ? data[id] : {}), ...record}]))};
  await cockpit.collectionSave("internal-data", {_id: READER_ID, data: updatedData});
  res.json({ok: true});

}
