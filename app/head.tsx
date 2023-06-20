import {site} from "../util/sites";

export default function Head() {

  const title = site("eni.wien", "Pfarre Emmaus");
  const description = site("Miteinander der Pfarren Emmaus, St. Nikolaus und Neustift", "Katholische Pfarre im zehnten Wiener Gemeindebezirk");
  return (
    <>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <link rel="shortcut icon" type="image/png" href={(site("/favicon.png", "/favicon-emmaus.png"))}/>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/social.png" />
    </>
  )
}
