import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {cockpit} from "../../../util/cockpit-sdk";
import {ReaderData, ReaderInfo, ReaderRole} from "../../../util/reader";

const READER_ID = "637b85bc376231d51500018d";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);
    const data: ReaderData = await cockpit.collectionGet("internal-data", {filter: {_id: READER_ID}}).then(x => x.entries[0].data);

    if (user === undefined) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    const isPlanner = user.permissions[Permission.ReaderPlanning];
    const isReader = user.permissions[Permission.Reader];
    if (!isPlanner && !isReader) {
        res.status(401).json({errorMessage: 'No sufficient role'});
        return;
    }
    if (!isPlanner) {
        const eventId = Object.keys(req.body)[0];
        const role = Object.keys(req.body[eventId])[0] as ReaderRole;
        const previousReaderInfo = data[eventId][role];
        const readerInfo = req.body[eventId][role] as ReaderInfo;
        if (previousReaderInfo.status !== "cancelled"
            || readerInfo.status !== "informed"
            || readerInfo.id !== user?._id
            || readerInfo.name !== user?.name) {
            res.status(401).json({errorMessage: 'Bad request'});
            return;
        }
    }

    const updatedData = {
        ...data,
        ...Object.fromEntries(
            Object.entries(req.body)
                .map(([id, record]: [string, any]) => [
                    id,
                    {...(data[id] ? data[id] : {}), ...record}
                ]))
    };
    await cockpit.collectionSave("internal-data", {_id: READER_ID, data: updatedData});
    res.json({ok: true});

}
