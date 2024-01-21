import {NextApiRequest, NextApiResponse} from 'next';
import {getWeekDayName} from "../../../components/calendar/Calendar";
import {LiturgyData} from "../liturgy";
import {sign} from "jsonwebtoken";
import {Cockpit} from "@/util/cockpit";
import {CalendarTag} from "@/domain/events/EventMapper";
import {loadEvents} from "@/domain/events/EventsLoader";
import {EventLoadAccess} from "@/domain/events/EventLoadOptions";
import {User} from "@/domain/users/User";
import {Permission} from "@/domain/users/Permission";
import {resolvePermissionsForCompetences} from "@/domain/users/PermissionResolver";
import {resolveUserFromRequest} from "@/domain/users/UserResolver";
import {getTasksForPerson, getTasksFromReaderData, getUninformedTasks, ReaderData} from "@/domain/service/Service";
import {sendMail} from "@/app/(shared)/Mailjet";

const READER_ID = "637b85bc376231d51500018d";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const user = resolveUserFromRequest(req);

    if (user === undefined || !user.permissions[Permission.ReaderPlanning]) {
        res.status(401).json({errorMessage: 'No permission'});
        return;
    }

    const data: ReaderData = await Cockpit.collectionGet("internal-data", {filter: {_id: READER_ID}}).then(x => x.entries[0].data);
    const events = await loadEvents({access: EventLoadAccess.READER, ids: Object.keys(data)}).then(x => x.events);
    const liturgy: LiturgyData = await Cockpit.collectionGet("internal-data", {filter: {id: "liturgy"}}).then(x => x.entries[0].data);
    const persons = await Cockpit.collectionGet('person').then(x => x.entries);
    const person = persons.find(p => p._id === req.body.personId)!;
    if (!person) {
        res.status(500).json({error: "Person not found"});
    }

    const tasks = getTasksFromReaderData(data, eventId => events.find(event => event.id === eventId)!);
    const tasksForPerson = getTasksForPerson(tasks, req.body.personId);
    const uniformedTasks = getUninformedTasks(tasksForPerson);
    const eventIds = uniformedTasks.map(task => task.event.id);

    const secretOrPrivateKey = Buffer.from(process.env.PRIVATE_KEY!, 'base64');

    const userlikeObject: User = {
        ...person,
        permissions: resolvePermissionsForCompetences(person.competences),
        api_key: `person_${person._id}`,
        is_person: true
    };
    const jwt = sign(userlikeObject, secretOrPrivateKey, {algorithm: 'RS256', expiresIn: "90d"})
    const link = `https://eni.wien/intern/login?redirect=/intern/reader/my&jwt=${jwt}`

    if (eventIds.length !== req.body.eventIds.length || eventIds.some(eventId => !req.body.eventIds.includes(eventId)) || !person) {
        res.status(400).json({errorMessage: 'Wrong request'});
        return;
    }

    if (person.email) {
        await sendMail(4375769, person.name, person.email, "Neue liturgische Dienste", {
                link: link,
                name: person.name,
                events: uniformedTasks
                    .map(task => ({
                        task,
                        date: new Date(task.event.start.dateTime),
                        reading: task.data.role === "reading1" || task.data.role === "reading2" ? liturgy[task.event.date].find(liturgy => data[task.event.id].liturgy === liturgy.name)?.[task.data.role] : ''
                    }))
                    .map(({task, date, reading}) => ({
                        date: `${getWeekDayName(date.getDay())}, ${date.toLocaleDateString("de-AT")}, ${date.toLocaleTimeString("de-AT", {timeZone: "Europe/Vienna"})}`,
                        summary: task.event.summary,
                        description: task.event.tags.includes(CalendarTag.private) ? '' : task.event.description,
                        info: `${{
                            reading1: "1. Lesung",
                            reading2: "2. Lesung",
                            communionMinister1: "1. Kommunionshelfer:in",
                            communionMinister2: "2. Kommunionshelfer:in",
                        }[task.data.role]} ${reading}`,
                        link: reading ? `https://www.bibleserver.com/EU/${encodeURI(reading)}` : '',
                    }))
            }
        )
        console.log("MAIL SENT OK");
    }
    res.json({ok: true});

}

