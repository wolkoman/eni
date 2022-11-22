import {NextApiRequest, NextApiResponse} from 'next';
import {Permission, resolveUserFromRequest} from '../../../util/verify';
import {cockpit} from "../../../util/cockpit-sdk";
import {getTasksForPerson, getTasksFromReaderData, getUninformedTasks, ReaderData} from "../../../util/reader";
import {getCachedEvents} from "../../../util/calendar-events";
import {getWeekDayName} from "../../../components/calendar/Calendar";
import {CalendarTag} from "../../../util/calendar-types";
import {LiturgyData} from "../liturgy";

const READER_ID = "637b85bc376231d51500018d";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || !user.permissions[Permission.Admin]) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    const events = await getCachedEvents(true).then(x => x.events);
    const data: ReaderData = await cockpit.collectionGet("internal-data", {filter: {_id: READER_ID}}).then(x => x.entries[0].data);
    const liturgy: LiturgyData = await cockpit.collectionGet("internal-data", {filter: {id: "liturgy"}}).then(x => x.entries[0].data);
    const persons = await cockpit.collectionGet('person').then(x => x.entries);
    const person = persons.find(p => p._id === req.body.personId);

    const tasks = getTasksFromReaderData(data, eventId => events.find(event => event.id === eventId)!);
    const tasksForPerson = getTasksForPerson(tasks, req.body.personId);
    const uniformedTasks = getUninformedTasks(tasksForPerson);
    const eventIds = uniformedTasks.map(task => task.event.id);


    if (eventIds.length !== req.body.eventIds.length || eventIds.some(eventId => !req.body.eventIds.includes(eventId)) || !person) {
        res.status(400).json({errorMessage: 'Wrong request'});
        return;
    }

    await fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.MJ_PUBLIC + ":" + process.env.MJ_PRIVATE).toString('base64'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "Messages": [
                {
                    "From": {
                        "Email": "admin@tesarekplatz.at",
                        "Name": user.name
                    },
                    "To": [
                        {
                            "Email": "raomvqdxr@karenkey.com",
                            "Name": "ma:" + person.name
                        }
                    ],
                    "TemplateID": 4375769,
                    "TemplateLanguage": true,
                    "Subject": "Lesetermine",
                    "Variables": {
                        "link": "https://google.com",
                        "name": person.name,
                        "events": uniformedTasks
                            .map(task => ({
                                task,
                                date: new Date(task.event.date),
                                liturgy: liturgy[task.event.date].find(liturgy => data[task.event.id].liturgy === liturgy.name)!,
                                reading: {reader1: "reading1", reader2: "reading2"}[task.data.role] as 'reading1' | 'reading2'
                            }))
                            .map(({task, date, liturgy, reading}) => ({
                                date: `${getWeekDayName(date.getDay())}, ${date.toLocaleDateString("de-AT")}`,
                                summary: task.event.summary?.replace(/\[.*?]/g, ''),
                                description: (task.event.tags.includes(CalendarTag.private) ? '' : task.event.description?.replace(/\[.*?]/g, '')) + "<br>" + liturgy.name,
                                info: `${{
                                    reader1: "1. Lesung",
                                    reader2: "2. Lesung"
                                }[task.data.role]} ${liturgy[reading]}`,
                                link: `https://www.bibleserver.com/EU/${encodeURI(liturgy[reading])}`,
                            }))
                    }
                }
            ]
        })
    }).then(response => {
        if(!response.ok){
         response.text().then(text => console.log("MJ_E", text))
        throw new Error("Mail not sent");
        }
        return response.json();
    }).then(response => console.log("MJ", response))
    res.json({ok: true});

}
