"use server"
import {Cockpit} from "@/util/cockpit";
import {CalendarName, getCalendarInfo} from "@/domain/events/CalendarInfo";
import {Permission} from "@/domain/users/Permission";
import {sendBulkMailV2} from "@/app/(shared)/Mailjet";
import {resolveUserFromServer} from "@/app/(shared)/UserHandler";
import {markWeeklyAsSent} from "@/app/intern/wochenmitteilungen-editor/upsert";
import {cockpit} from "@/util/cockpit-sdk";

const chunk = <T>(array: T[], size: number) => array.reduce<T[][]>((acc, _, i) => {
  if (i % size === 0) acc.push(array.slice(i, i + size))
  return acc
}, [])

export default async function sendWeeklyNewsletter(title: string, slogan: string, evangelium: string, infos: {
  emmaus: string,
  inzersdorf: string,
  neustift: string
}) {

  const user = await resolveUserFromServer();

  if (user === undefined || !user.permissions[Permission.Admin]) return "Keine Berechtigung"

  const weeklyWithSameName = await cockpit.collectionGet("weekly_v2", {filter: { name: title }})
      .then(({entries}) => entries?.[0])
  if(weeklyWithSameName?.sent) return "Diese Wochenmitteilungen wurden schon versandt";
  await markWeeklyAsSent(title)

  const recipients: {
    anrede: string,
    mail: string,
    parish: string[]
  }[] = await Cockpit.collectionGet("internal-data", {filter: {id: "newsletter_v2"}})
    .then(({entries}) => entries[0].data);

  await Promise.all(chunk(recipients, 49).map(recipients => sendBulkMailV2(5874901, recipients.map(recipient => ({
    mail: recipient.mail,
    name: recipient.anrede.split(" ").slice(1).join(" "),
    subject: title + ": " + slogan,
    variables: {
      evangelium: evangelium,
      anrede: recipient.anrede,
      info: Object.entries(infos)
        .filter(([parish, text]) => recipient.parish.includes(parish))
        .map(([parish, text]) => `<b>${getCalendarInfo(parish as CalendarName).fullName}:</b> ${text}`)
        .join("<br><br>")
    }
  })))))
  return recipients.length;
}
