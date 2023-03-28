import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from "../../../util/verify";
import {sendBulkMail} from "../../../util/mailjet";
import {cockpit} from "../../../util/cockpit-sdk";
import {fetchCurrentWeeklies} from "../../../util/fetchWeeklies";
import {CalendarName, getCalendarInfo} from "../../../util/calendar-info";

const lastMailId = '640735d7353062f2d200017b';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);
    const message = req.body.message?.replaceAll("\n", '<br>');

    if (!message) {
        res.json({errorMessage: 'No message'});
        return;
    }
    if (user === undefined || !user.permissions[Permission.Admin]) {
        res.json({errorMessage: 'No permission'});
        return;
    }
    const diffSinceLastMail = await cockpit.collectionGet("internal-data", {filter: {_id: lastMailId}})
        .then(({entries}) => new Date().getTime() - new Date(entries[0].data.date).getTime());
    if (diffSinceLastMail < 1000 * 60 * 60 * 24 * 5) {
        res.json({errorMessage: "Eine Mail wurde erst vor kurzem versendet!"});
        return;
    }
    const diffSinceLastNews = await fetchCurrentWeeklies().then(x => new Date().getTime() - new Date(x._created * 1000).getTime());
    if (diffSinceLastNews > 1000 * 60 * 60 * 5) {
        res.json({errorMessage: "Die letzten Wochenmitteilungen liegen zu lange zurück!"});
        return;
    }

    await cockpit.collectionSave("internal-data", {_id: lastMailId, data: {date: new Date().toISOString()}});

    const subject = 'Wochenmitteilungen ' + new Date().toLocaleDateString("de-AT");
    const recipients: Record<CalendarName, string[]> = await cockpit.collectionGet("internal-data", {filter: {id: "newsletter"}}).then(({entries}) => entries[0].data);

    await Promise.all([CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT].map(calendar =>
        sendBulkMail(4636128, recipients[calendar].map(mail => ({
            mail,
            name: "Gemeindemitglied " + getCalendarInfo(calendar).shortName
        })), subject, {
            message,
            parish: getCalendarInfo(calendar).shortName,
            link: `https://eni.wien/api/weekly?parish=${calendar}`
        }, true)
    ))
        .then(() => res.json({ok: true}))
        .catch(() => res.json({errorMessage: "Mail konnte nicht gesendet werden!"}))
}
