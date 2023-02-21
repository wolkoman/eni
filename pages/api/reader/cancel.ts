import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {cockpit} from "../../../util/cockpit-sdk";
import {ReaderData, ReaderInfo} from "../../../util/reader";
import {notifyAdmin} from "../../../util/telegram";

const READER_ID = "637b85bc376231d51500018d";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || (!user.permissions[Permission.Reader] && !user.permissions[Permission.CommunionMinister])) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    let data: ReaderData = await cockpit.collectionGet("internal-data", {filter: {_id: READER_ID}}).then(x => x.entries[0].data);

    const role = req.body.role as 'reading1' | 'reading2';
    const eventId = req.body.eventId;
    const readerInfo: ReaderInfo = data[eventId][role];
    if (readerInfo.id !== user._id) {
        res.status(401).json({errorMessage: 'Not u!'});
        return;
    }

    await notifyAdmin(`${user.name} has cancelled ${role} (${eventId})`);
    readerInfo.status = "cancelled";
    data[eventId].cancelledBy = [...(data[eventId].cancelledBy?.filter(id => id !== user._id) ?? []), user._id]

    await cockpit.collectionSave("internal-data", {_id: READER_ID, data});
    res.json({ok: true});

}
