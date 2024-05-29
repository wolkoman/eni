"use server"
import { parse } from 'node-html-parser';

export async function loadEvangelium(start: Date) {
  const nextSunday = new Date(start.getTime() + (start.getDay() ? 7 - start.getDay() : 0) * 3600 * 1000 * 24)
  const date = nextSunday.toISOString().substring(0, 10).replaceAll("-","/")
  const link = `https://www.vaticannews.va/de/tagesevangelium-und-tagesliturgie/${date}.html`;
  return await fetch(link)
    .then(response => response.text())
    .then(html => {
      const document = parse(html);

      const h2 = Array.from(document.querySelectorAll("h2")).find(h2 => h2.innerText == "Evangelium vom Tag")
      const sectionHead = h2?.parentNode
      if(sectionHead?.classNames !== "section__head") return {place: "", text: "Invalid section head"}
      const sectionWrapper = sectionHead.parentNode.querySelector(".section__content")
      if(!sectionWrapper) return {place: "", text: "Invalid section wrapper"}

      const place = Array.from(sectionWrapper.childNodes[1].childNodes)
      console.log(sectionWrapper.childNodes)
      const text = sectionWrapper.childNodes[3].textContent

      return {place: place[2].innerText, text: text}
    });

}
