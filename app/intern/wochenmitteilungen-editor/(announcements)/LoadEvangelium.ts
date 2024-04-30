"use server"
import {XMLParser} from "fast-xml-parser";

const parsingOptions = {
  ignoreAttributes: false,
  preserveOrder: true,
  unpairedTags: ["hr", "br", "link", "meta"],
  stopNodes: ["*.pre", "*.script"],
  processEntities: true,
  htmlEntities: true,
  alwaysCreateTextNodes: true
};

export async function loadEvangelium(start: Date) {
  const nextSunday = new Date(start.getTime() + (start.getDay() ? 7 - start.getDay() : 0) * 3600 * 1000 * 24)
  const date = nextSunday.toISOString().substring(0, 10)
  const link = `https://www.erzabtei-beuron.de/schott/schott_anz/index.html?datum=${date}`;
  return await fetch(link)
    .then(response => response.text())
    .then(html => {
      html = html.substring(html.indexOf("<h2 class=\"lb_u1\">Evangelium"))
      html = html.substring(0, html.indexOf("<h2 class=\"s_u1\">"))
      const body = new XMLParser(parsingOptions).parse(html);

      console.log({date, html})
      const [{h2: [_, {span: [{"#text": place}]}]}, ...p] = body
      const text = p
        .filter((e: any) => e?.[":@"]?.["@_class"].startsWith("lb_tx"))
        .flatMap((e: any) => e.p).map((e: any) => {
          if (e?.[":@"]?.["@_class"].startsWith("lb_tx")) {
            const firstSpan: any = e.span.map((span: any) => span["#text"]).join("");
            return firstSpan
          } else if (e?.["#text"]) {
            return e?.["#text"]
          } else {
            return ""
          }
        }).join(" ")

      return {place: decodeURIComponent(place), text: decodeURIComponent(text)};
    })
}
