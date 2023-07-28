import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from "../../../util/verify";
import {sendBulkMail} from "../../../util/mailjet";
import {fetchCurrentWeeklies} from "../../../util/fetchWeeklies";
import {Cockpit} from "../../../util/cockpit";
import {CalendarName, getCalendarInfo} from "../../../app/termine/CalendarInfo";

const lastMailId = '640735d7353062f2d200017b';

const chunk = <T>(array: T[], size: number) => {
    console.log({array, size})
    return array.reduce<T[][]>((acc, _, i) => {
        if (i % size === 0) acc.push(array.slice(i, i + size))
        return acc
    }, []);
}

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
    const diffSinceLastMail = await Cockpit.collectionGet("internal-data", {filter: {_id: lastMailId}})
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

    await Cockpit.collectionSave("internal-data", {_id: lastMailId, data: {date: new Date().toISOString()}});

    const subject = 'Wochenmitteilungen ' + new Date().toLocaleDateString("de-AT");
    const recipients: Record<CalendarName, string[]> = await Cockpit.collectionGet("internal-data", {filter: {id: "newsletter"}}).then(({entries}) => entries[0].data);

    await Promise.all(
        [CalendarName.EMMAUS, CalendarName.INZERSDORF, CalendarName.NEUSTIFT]
            .map(calendar => ({calendar, recipients: chunk(recipients[calendar], 49)}))
            .flatMap(({calendar, recipients}) => recipients.map(recipients => ({calendar, recipients})))
            .map(({calendar, recipients}) =>
                sendBulkMail(4636128, recipients.map(mail => ({
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
