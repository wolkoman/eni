"use client"

import React, {ReactNode, useEffect, useRef, useState} from 'react';
import Site from "../../components/Site";
import Head from "next/head";

function Song(props: { children: ReactNode, title: string }) {
  return <div className="snap-center w-full shrink-0 overflow-y-scroll px-4">
    <div className="text-center font-bold text-3xl pt-8 pb-6">{props.title}</div>
    <div className="whitespace-pre-line text-xl">{props.children}</div>
  </div>;
}

export default function HomePage() {

  const ref = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0)
  const [maxPage, setMaxPage] = useState(0)
  const [darkmode, setDarkmode] = useState(false)

  useEffect(() => {
    const listener = () => {
      setCurrentPage(Math.round((ref.current?.scrollLeft ?? 0) / (ref.current?.clientWidth ?? 1)))
      setMaxPage((ref.current?.scrollWidth ?? 0) / (ref.current?.clientWidth ?? 1))
    };
    ref.current?.addEventListener("scroll", listener)
    return () => ref.current?.removeEventListener("scroll", listener)
  }, [ref?.current])
  useEffect(() => {

  }, [currentPage])

  const next = (value: number) => () => {
    ref.current!.scrollTo({left: (ref.current?.clientWidth ?? 0) * (currentPage + value), behavior: 'smooth'})
  };

  return <Site title="Worship 12.05." navbar={false} footer={false} responsive={false}>
    <Head>
      <meta name="theme-color" content={darkmode ? "black" : "#8BB4F4"}/>
    </Head>
    <div className={`h-screen flex flex-col ${darkmode && "bg-black text-white"}`}>
      <div className="p-4 border-b border-black/10 flex justify-between ">
        <div className="text-2xl font-bold italic opacity-70">WORSHIP</div>
        <div className="flex grow justify-end gap-4 h-6">
          <img src="https://svgur.com/i/t10.svg" className="h-6" onClick={() => setDarkmode(x => !x)}/>
          {currentPage !== 0 &&
              <img src="https://svgur.com/i/t0d.svg" className="h-6" onClick={next(-1)}/>}
          {currentPage !== maxPage - 1 &&
              <img src="https://svgur.com/i/szV.svg" className="h-6" onClick={next(1)}/>}
        </div>
      </div>
      <div className="flex snap-x snap-mandatory overflow-auto grow-1" ref={ref}>
        {Object.entries(songs).map(([title, lyrics]) => <Song title={title} key={title}>{lyrics}</Song>)}
      </div>
    </div>
  </Site>
}

const songs = {
  "Thy Word": `Thy Word is a lamp unto my feet and a light unto my path
    Thy Word is a lamp unto my feet and a light unto my path
    
    When I feel afraid
    Think I've lost my way
    Still you're there right beside me
    And nothing will I fear
    As long as you are near
    Please be near me to the end
    
    Thy Word is a lamp unto my feet and a light unto my path
    Thy Word is a lamp unto my feet and a light unto my path
    
    I will not forget
    Your love for me and yet
    My heart forever is wandering
    Jesus be my guide
    And hold me to your side
    I will love you to the end
    
    Nothing will I fear as long as you are near
    Please be near me to the end
    
    Thy Word is a lamp unto my feet and a light unto my path
    Thy Word is a lamp unto my feet and a light unto my path
    
    And a light unto my path
    You're the light unto my path
    
    Nebel rings umher,
    ich sehe dich nicht mehr,
    wie find ich den Weg?
    Dein Wort ist das Licht,
    das durch den Nebel bricht.
    Du führst mich an deiner Hand.
    
    Dein Wort ist ein Licht auf meinem Weg,
    wenn ich durch das Dunkel geh.
    Dein Wort ist ein Licht auf meinem Weg,
    lässt mich deine Hilfe sehn.
    
    `,

  "Herr ich komme zu dir": ` Herr, ich komme zu Dir,
Und ich steh' vor Dir, so wie ich bin
Alles was mich bewegt lege ich vor Dich hin.
 
Herr, ich komme zu Dir,
Und ich schütte mein Herz bei Dir aus.
Was mich hindert ganz bei Dir zu sein räume aus!
 
Meine Sorgen sind Dir nicht verborgen,
Du wirst sorgen für mich.
Voll Vertrauen will ich auf Dich schauen.
Herr, ich baue auf Dich!
 
Gib mir ein neues ungeteiltes Herz.
Lege ein neues Lied in meinen Mund.
Fülle mich neu mit Deinem Geist,
Denn Du bewirkst ein Lob in mir.
 
Herr, ich komme zu Dir,
Und ich steh' vor Dir, so wie ich bin
Alles was mich bewegt lege ich vor Dich hin.
 
Herr, ich komme zu Dir,
Und ich schütte mein Herz bei Dir aus.
Was mich hindert ganz bei Dir zu sein räume aus!
 
Meine Sorgen sind Dir nicht verborgen,
Du wirst sorgen für mich.
Voll Vertrauen will ich auf Dich schauen.
Herr, ich baue auf Dich!
 
Gib mir ein neues ungeteiltes Herz.
Lege ein neues Lied in meinen Mund.
Fülle mich neu mit Deinem Geist,
Denn Du bewirkst ein Lob in mir.`,


  "So Groß Ist Der Herr": `
            Ein König voller Pracht,
            Voll Weisheit und voll Macht.
            Die Schöpfung betet an, die Schöpfung betet an.
            Er kleidet sich in Licht. Das Dunkel hält ihn nicht
            Und flieht, sobald er spricht, und flieht, sobald er spricht.

            So groß ist der Herr, sing mit mir.
            So groß ist der Herr.
            Ihn preisen wir.
            So groß, so groß ist der Herr.

            Von Anbeginn der Zeit bis in die Ewigkeit
            Bleibt er derselbe Gott, bleibt er derselbe Gott.
            Als Vater, Sohn und Geist, den alle Schöpfung preist,
            Als Löwe und als Lamm, als Löwe und als Lamm

            So groß ist der Herr, sing mit mir.
            So groß ist der Herr.
            Ihn preisen wir.
            So groß, so groß ist der Herr.

            Sein Name sei erhöht, denn er verdient das Lob.
            Wir singen laut: So groß ist der Herr.`,

  "Here I Am To Worship": `
            Verse 1
            Light of the world, You stepped down into darkness
            Opened my eyes, let me see
            Beauty that made this heart adore You
            Hope of a life spent with You
            
            Chorus
            So, here I am to worship, Here I am to bow down
            Here I am to say that You’re my God
            You’re altogether lovely, altogether worthy
            Altogether wonderful to me
            
            Verse 2
            King of all days, oh so highly exalted
            Glorious in Heaven above
            Humbly You came to the Earth You created
            All for love’s sake became poor
            
            Chorus
            So, here I am to worship, Here I am to bow down
            Here I am to say that You’re my God
            You’re altogether lovely, altogether worthy
            Altogether wonderful to me
            
            Bridge
            And I’ll never know how much it cost
            To see my sin upon that cross
            And I’ll never know how much it cost
            To see my sin upon that cross
            
            Chorus
            So, here I am to worship, Here I am to bow down
            Here I am to say that You’re my God
            You’re altogether lovely, altogether worthy
            Altogether wonderful to me
        `,

  "What A Wonderful Name it is": `Verse 1
You were the Word at the beginning
One with God the Lord Most High
Your hidden glory in creation
Now revealed in You our Christ

Chorus 1
What a beautiful Name it is
What a beautiful Name it is
The Name of Jesus Christ my King
What a beautiful Name it is
Nothing compares to this
What a beautiful Name it is
The Name of Jesus

Verse 2
You didn’t want heaven without us
So Jesus You brought heaven down
My sin was great Your love was greater
What could separate us now

Chorus 2
What a wonderful Name it is
What a wonderful Name it is
The Name of Jesus Christ my King
What a wonderful Name it is
Nothing compares to this
What a wonderful Name it is
The Name of Jesus
What a wonderful Name it is
The Name of Jesus

Bridge
Death could not hold You
The veil tore before You
You silence the boast of sin and grave
The heavens are roaring
The praise of Your glory
For You are raised to life again

You have no rival
You have no equal
Now and forever God You reign
Yours is the kingdom
Yours is the glory
Yours is the Name above all names

Chorus 3
What a powerful Name it is
What a powerful Name it is
The Name of Jesus Christ my King
What a powerful Name it is
Nothing can stand against
What a powerful Name it is
The Name of Jesus`,

}
