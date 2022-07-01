import React, {useState} from 'react';
import Site from '../components/Site';

function Lied(){

}

export default function HomePage() {
    function getDiv(lied: string[]) {
        const [open,setOpen] = useState(false)
        // @ts-ignore
        return <div key={lied}>
            <div className={"font-bold my-4 p-3 bg-black/10 rounded"} onClick={() => setOpen(!open)}>{lied[0]}</div>
            {open && lied.slice(1).map(line => {
                if (line.trim().startsWith("Refrain") || line.trim().startsWith("Strophe") || line.trim().startsWith("Bridge")) {
                    return <div className="italic mt-2">{line}</div>;
                } else {
                    return <div className="text-lg">{line}</div>;
                }
            })}
        </div>;
    }
    const [dark,setDark] = useState(false)

    return <Site responsive={true} navbar={false} footer={false}>
        {dark && <style>
            {`body{background:black;}`}
        </style>}
        <div className={dark ? "bg-black text-white": ""}>
        <div className={`flex flex-wrap items-center justify-between `}>
            <div className="font-bold text-center text-lg my-8 text-blue-600">Worship 01.07.2022</div>
            <div className={`w-10 h-10 rounded-full flex-shrink-0 ${dark ? "bg-white": "bg-black "}`} onClick={() => setDark(!dark)}></div>
        </div>

        {lieder.split("\n\n").map(lied => lied.split("\n")).map(lied => getDiv(lied))}
        </div>

    </Site>
}

const lieder = `Komm und lobe den Herrn
        Refrain
        Komm und lobe den Herrn,
        meine Seele sing,
        bete den König an.
        Sing wie niemals zuvor
        nur für ihn,
        und bete den König an.
        Strophe 1
        Ein neuer Tag und ein neuer Morgen,
        und wieder bring ich Dir mein Lob.
        Was auch vor mir liegt und was immer auch geschehen mag:
        lass mich noch singen, wenn der Abend kommt.
        Refrain
        Komm und lobe den Herrn,
        meine Seele sing,
        bete den König an.
        Sing wie niemals zuvor
        nur für ihn,
        und bete den König an.
        Strophe 2
        Du liebst so sehr und vergibst geduldig,
        schenkst Gnade, Trost und Barmherzigkeit.
        Von Deiner Güte will ich immer singen:
        zehntausend Gründe gibst du mir dafür.
        Refrain
        Komm und lobe den Herrn,
        meine Seele sing,
        bete den König an.
        Sing wie niemals zuvor
        nur für ihn,
        und bete den König an.
        Strophe 3
        Und wenn am Ende die Kräfte schwinden,
        wenn meine Zeit dann gekommen ist,
        wird meine Seele Dich weiter preisen:
        zehntausend Jahre und in Ewigkeit.
        Refrain
        Komm und lobe den Herrn,
        meine Seele sing,
        bete den König an.
        Sing wie niemals zuvor
        nur für ihn,
        und bete den König an.

        So groß ist der Herr
        Strophe 1
        Ein König voller Pracht,
        voll Weisheit und voll Macht.
        Die Schöpfung betet an, die Schöpfung betet an.
        Er kleidet sich in Licht. Das Dunkel hält ihn nicht
        und flieht, sobald er spricht, und flieht, sobald er spricht.
        Refrain
        So groß ist der Herr, sing mit mir.
        So groß ist der Herr,
        ihn preisen wir.
        So groß, so groß ist der Herr.
        Bridge
        Sein Name sei erhöht, denn er verdient das Lob.
        Wir singen laut: So groß ist der Herr.
        Strophe 2
        Von Anbeginn der Zeit bis in die Ewigkeit
        bleibt er derselbe Gott, bleibt er derselbe Gott
        als Vater, Sohn und Geist, den alle Schöpfung preist,
        als Löwe und als Lamm, als Löwe und als Lamm.
        Refrain
        So groß ist der Herr, sing mit mir.
        So groß ist der Herr,
        ihn preisen wir.
        So groß, so groß ist der Herr.
        Bridge
        Sein Name sei erhöht, denn er verdient das Lob.
        Wir singen laut: So groß ist der Herr.

        Dank sei dir, o Herr
        Dank sei dir, o Herr, Dank sei dir.
        Dank sei dir, o Herr, Dank sei dir.

        Rückenwind
        Refrain 2x
        Du bist der Herr, der mein Haupt erhebt,
        Du bist die Kraft, die mein Herz belebt.
        Du bist die Stimme, die mich ruft,
        Du gibst mir Rückenwind.
        Strophe 1
        Du flößt mir Vertrauen ein, treibst meine Ängste aus,
        Du glaubst an mich, traust mir was zu, forderst mich heraus.
        Deine Liebe ist ein Wasserfall auf meinen Wüstensand.
        Und wenn ich mir nicht sicher bin, führt mich Deine Hand.
        Refrain 2x
        Du bist der Herr, der mein Haupt erhebt,
        Du bist die Kraft, die mein Herz belebt.
        Du bist die Stimme, die mich ruft,
        Du gibst mir Rückenwind.
        Bridge
        Wind des Herrn, weh in meinem Leben,
        Geist des Herrn, fach das Feuer an
        Wind des Herrn, hast mir Kraft gegeben,
        Geist des Herrn, sei mein Rückenwind
        Refrain 2x
        Du bist der Herr, der mein Haupt erhebt,
        Du bist die Kraft, die mein Herz belebt.
        Du bist die Stimme, die mich ruft,
        Du gibst mir Rückenwind.

        Klatscht in die Hände
        Refrain
        Klatscht in die Hände und jauchzt,
        König ist unser Gott.
        Klatscht in die Hände und jauchzt,
        König ist unser Gott,
        denn er sitzt auf dem Thron und regiert,
        denn er sitzt auf dem Thron und regiert.
        Strophe 1
        Er hat entwaffnet den Fürst dieser Welt
        und hat über die Mächte triumphiert.
        Refrain
        Klatscht in die Hände und jauchzt,
        König ist unser Gott.
        Klatscht in die Hände und jauchzt,
        König ist unser Gott,
        denn er sitzt auf dem Thron und regiert,
        denn er sitzt auf dem Thron und regiert.
        Strophe 2
        Ehre, Macht und Herrlichkeit gehört ihm allein.
        Halleluja.
        Refrain
        Klatscht in die Hände und jauchzt,
        König ist unser Gott.
        Klatscht in die Hände und jauchzt,
        König ist unser Gott,
        denn er sitzt auf dem Thron und regiert,
        denn er sitzt auf dem Thron und regiert.

        Awesome God
        Strophe 1
        Oh, when he rolls up his sleeves he ain’t just puttin’ on the ritz.
        Our God is an awesome God.
        There is thunder in his footsteps and lightning in his fists.
        Our God is an awesome God.
        And the Lord wasn’t joking when he kicked’em out of Eden.
        It wasn’t for no reason that he shed his blood.
        His return is very close and so you better be believin’ that
        our God is an awesome God.
        Refrain
        Our God is an awesome God,
        he reigns from heaven above with wisdom, pow’r and love.
        Our God is an awesome God.
        Our God is an awesome God,
        he reigns from heaven above with wisdom, pow’r and love.
        Our God is an awesome God.
        Strophe 2
        And when the sky was starless in the void of the night.
        Our God is an awesome God.
        He spoke into the darkness and created the light.
        Our God is an awesome God.
        And judgement and wrath he poured out on Sodom.
        Mercy and grace he gave us at the cross.
        I hope that we have not too quickly forgotten that
        our God is an awesome God.
        Refrain
        Our God is an awesome God,
        he reigns from heaven above with wisdom, pow’r and love.
        Our God is an awesome God.
        Our God is an awesome God,
        he reigns from heaven above with wisdom, pow’r and love.
        Our God is an awesome God.`;