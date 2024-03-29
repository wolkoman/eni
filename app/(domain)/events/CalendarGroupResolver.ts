import {calendar_v3} from "googleapis";
import {CalendarGroup} from "@/domain/events/CalendarGroup";

export function getGroupFromEvent(event: calendar_v3.Schema$Event): CalendarGroup[] {
    const sum = event.summary?.toLowerCase() ?? "";
    let conditions: (CalendarGroup | false)[] = [
        sum.includes("wallfahrt") && CalendarGroup.Wallfahrt,
        sum.includes("abendmahl") && CalendarGroup.Messe,
        sum.includes("gründonnerstagsl") && CalendarGroup.Messe,
        sum.includes("auferstehungsfeier") && CalendarGroup.Messe,
        sum.includes("hochamt") && CalendarGroup.Messe,
        sum.includes("messe") && CalendarGroup.Messe,
        sum.includes("mette") && CalendarGroup.Messe,
        sum.includes("firmung") && !sum.includes("anmeldung") && !sum.includes("info") && CalendarGroup.Messe,
        sum.startsWith("friedensgebet") && CalendarGroup.Gebet,
        sum.includes("emmausgebet") && CalendarGroup.Gebet,
        sum.includes("rosenkranz") && CalendarGroup.Gebet,
        sum.includes("gebetsrunde") && CalendarGroup.Gebet,
        sum.includes("bibelrunde") && CalendarGroup.Gebet,
        sum.includes("bibelgespräch") && CalendarGroup.Gebet,
        sum.includes("bibelkreis") && CalendarGroup.Gebet,
        sum.includes("glaubensabend") && CalendarGroup.Gebet,
        sum.includes("friedhofsgang") && CalendarGroup.Gebet,
        sum.includes("sprechstunde mit jesus") && CalendarGroup.Gebet,
        sum.includes("maiandacht") && CalendarGroup.Gebet,
        sum.includes("wärmestube") && CalendarGroup.Caritas,
        sum.includes("klimaoase") && CalendarGroup.Caritas,
        sum.includes("caritas") && CalendarGroup.Caritas,
        sum.includes("jungschar") && CalendarGroup.Kinder,
        sum.includes("eltern-kind-treff") && CalendarGroup.Kinder,
        sum.includes("mädchenabend") && CalendarGroup.Kinder,
        sum.includes("ministrantenstunde") && CalendarGroup.Kinder,
        sum.includes("sternsing") && CalendarGroup.Kinder,
        sum.startsWith("kinderstunde") && CalendarGroup.Kinder,
        sum.includes("ferienspiel") && CalendarGroup.Kinder,
        sum.startsWith("familien") && CalendarGroup.Kinder,
        sum.includes("hl. martin") && CalendarGroup.Kinder,
        sum.includes("woche des lebens") && CalendarGroup.Kinder,
        sum.includes("kinder") && CalendarGroup.Kinder,
        sum.includes("jugendtreffen") && CalendarGroup.Jugend,
        sum.startsWith("plauder") && CalendarGroup.Gemeinschaft,
        sum.includes("zusammenkommen") && CalendarGroup.Gemeinschaft,
        sum.includes("gschnas") && CalendarGroup.Gemeinschaft,
        sum.includes("sommerfest") && CalendarGroup.Gemeinschaft,
        sum.includes("workshop") && CalendarGroup.Gemeinschaft,
        sum.includes("punschstand") && CalendarGroup.Gemeinschaft,
        sum.includes("liedersingen") && CalendarGroup.Gemeinschaft,
        sum.includes("lieder-singen") && CalendarGroup.Gemeinschaft,
        sum.includes("flohmarkt") && CalendarGroup.Gemeinschaft,
        sum.includes("50+ treff") && CalendarGroup.Gemeinschaft,
        sum.includes("glaubenserfahrung") && CalendarGroup.Gebet,
        sum.includes("offene kirche") && CalendarGroup.Gebet,
        sum.startsWith("bibel aktiv") && CalendarGroup.Gebet,
        sum.includes("liturgie") && CalendarGroup.Gottesdienst,
        sum.includes("kreuzweg") && CalendarGroup.Gottesdienst,
        sum.includes("andacht") && CalendarGroup.Gottesdienst,
        sum.startsWith("vesper") && CalendarGroup.Gottesdienst,
        sum.includes("worship") && CalendarGroup.Gottesdienst,
        sum.includes("segnung") && CalendarGroup.Gottesdienst,
        sum.includes("anbetung") && CalendarGroup.Gottesdienst,
        sum.includes("wortgottesfeier") && CalendarGroup.Gottesdienst,
        sum.includes("gottesdienst") && !sum.includes("evang") && CalendarGroup.Gottesdienst,
        sum.includes("nikolaus") && CalendarGroup.Advent,
        sum.includes("advent") && CalendarGroup.Advent,
        sum.includes("rorate") && CalendarGroup.Advent,
        sum.includes("liedersingen") && CalendarGroup.Advent,
        sum.includes("punschstand") && CalendarGroup.Advent,
        sum.includes("krippenspiel") && sum.includes("probe") && CalendarGroup.Kinder,
        sum.includes("krippenspiel") && !sum.includes("probe") && CalendarGroup.Weihnachten,
        sum.includes("mette") && CalendarGroup.Weihnachten,
        sum.includes("heiligabend") && CalendarGroup.Weihnachten,
        sum.includes("mette") && CalendarGroup.Weihnachten,
        sum.includes("oster") && CalendarGroup.Ostern,
        sum.includes("kreuzweg") && CalendarGroup.Ostern,
        sum.includes("speisensegnung") && CalendarGroup.Ostern,
        sum.includes("abendmahl") && CalendarGroup.Ostern,
        sum.includes("auferstehungsfeier") && CalendarGroup.Ostern,
        sum.startsWith("grabwache") && CalendarGroup.Ostern,
        sum.includes("aschermittwoch") && CalendarGroup.Ostern,
        sum.includes("jesu am kreuz") && CalendarGroup.Ostern,
        sum.includes("bußfeier") && CalendarGroup.Ostern,
        sum.includes("gründonnerstag") && CalendarGroup.Ostern,
        sum.includes("karfreitag") && CalendarGroup.Ostern,
        sum.includes("evangel") && CalendarGroup.Invisible,
        sum.includes("taufe") && CalendarGroup.Invisible,
        sum.includes(" ehe") && CalendarGroup.Invisible,
        sum.includes("priesternotruf") && CalendarGroup.Invisible,
        sum.includes("vokalenmsemble") && CalendarGroup.Invisible,
        sum.includes("junschar") && CalendarGroup.Invisible,
        sum.includes("krankenbesuche") && CalendarGroup.Invisible,
        sum.includes("motorrad") && CalendarGroup.Invisible,
        sum.includes("generalprobe") && CalendarGroup.Invisible,
        sum.includes("sprechstunde") && CalendarGroup.Invisible,
        sum.includes("sprech/") && CalendarGroup.Invisible,
        sum.includes("sitzung") && CalendarGroup.Gremien,
        sum.includes("pfarrgemeinderat") && CalendarGroup.Gremien,
        sum.includes("chor") && CalendarGroup.Chor,
        sum.includes("vokalensemble") && CalendarGroup.Chor,
        sum.includes("lima") && CalendarGroup.Gemeinschaft,
        sum.includes("erstkommunion") && CalendarGroup.Sakramente,
        sum.startsWith("taufe") && CalendarGroup.Sakramente,
        sum.includes("firmkurs") && CalendarGroup.Sakramente,
        sum.includes("firmvorbereitung") && CalendarGroup.Sakramente,
        sum.includes("firmung") && sum.includes("anmeldung") && CalendarGroup.Sakramente,
        sum.includes("firmung") && sum.includes("info") && CalendarGroup.Sakramente,
        (event.description?.includes("lndk") ?? false) && CalendarGroup.LNDK,
    ];
    let groups = conditions.filter((group): group is CalendarGroup => !!group);

    if (groups.length === 0 && event.visibility !== "private") {
        //notifyAdmin(`unknown event group: ${event.summary} ${JSON.stringify(event.start)}`);
    }

    return groups.filter(group => group !== CalendarGroup.Invisible);
}
