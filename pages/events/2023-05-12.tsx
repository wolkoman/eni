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
                <img src="https://svgur.com/i/t1A.svg" className="h-6"/>
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
    "Come To The Altar": `
            Are you hurting and broken within?
            Overwhelmed by the weight of your sin?
            Jesus is calling
            Have you come to the end of yourself
            Do you thirst for a drink from the well?
            Jesus is calling

            O come to the altar
            The Father's arms are open wide
            Forgiveness was bought with
            The precious blood of Jesus Christ

            Leave behind your regrets and mistakes
            Come today, there's no reason to wait
            Jesus is calling
            Bring your sorrows and trade them for joy
            From the ashes, a new life is born
            Jesus is calling (oh, oh)

            O come to the altar
            The Father's arms are open wide
            Forgiveness was bought with
            The precious blood of Jesus Christ

            O come to the altar
            The Father's arms are open wide
            Forgiveness was bought with
            The precious blood of Jesus Christ

            Savior
            What a Savior

            Oh, what a Savior
            Isn't He wonderful?
            Sing Hallelujah, Christ is risen
            Bow down before Him
            For He is Lord of all
            Sing Hallelujah, Christ is risen

            Oh, what a Savior
            Isn't He wonderful?
            Sing Hallelujah, Christ is risen
            Bow down before Him
            For He is Lord of all
            Sing Hallelujah, Christ is risen

            O come to the altar
            The Father's arms are open wide
            Forgiveness was bought with
            The precious blood of Jesus Christ

            O come to the altar
            The Father's arms are open wide
            Forgiveness was bought with
            The precious blood of Jesus Christ (oh-oh)

            Bear your cross as you wait for the crown
            Tell the world of the treasure you found`,

    "Mighty To Save": `[Verse 1]
Well, everyone needs compassion
A love that's never failing
Let mercy fall on me
Well, everyone needs forgiveness
The kindness of a Saviour
The hope of nations

    [Chorus]
Saviour, He can move the mountains
And my God is mighty to save, He is mighty to save
Forever, Author of Salvation
He rose and conquered the grave
Jesus conquered the grave

    [Verse 2]
So take me as You find me
All my fears and failures
And fill my life again
I give my life to follow
Everything I believe in
And now I surrender, I surrender

    [Chorus]
Saviour, He can move the mountains
My God is mighty to save, He is mighty to save
Forever, Author of Salvation
He rose and conquered the grave
Jesus conquered the grave
Saviour, He can move the mountains
My God is mighty to save, He is mighty to save
Forever, Author of Salvation
He rose and conquered the grave
Jesus conquered the grave

    [Bridge]
Shine your light and let the whole world see
We're singing for the glory of the risen King, Jesus
Shine your light and let the whole world see
We're singing for the glory of the risen King

    [Chorus]
Saviour, He can move the mountains
My God is mighty to save, He is mighty to save
Forever, Author of Salvation
He rose and conquered the grave
Jesus conquered the grave
Saviour, He can move the mountains
My God is mighty to save, He is mighty to save
Forever, Author of Salvation
He rose and conquered the grave
Jesus conquered the grave

    [Outro]
Shine your light and let the whole world see
We're singing for the glory of the risen King, Jesus
Shine your light and let the whole world see
We're singing for the glory of the risen King, Jesus
Shine your light and let the whole world see
We're singing for the glory of the risen King, Jesus
Shine your light and let the whole world see
We're singing for the glory of the risen King, Jesus
Shine your light and let the whole world see
We're singing for the glory of the risen King, Jesus
Shine your light and let the whole world see
We're singing for the glory of the risen King`,

    "What A Beautiful Name": `[Verse 1]
            You were the Word at the beginning
            One with God the Lord Most High
            Your hidden glory in creation
            Now revealed in You our Christ
            
            [Chorus]
            What a beautiful Name it is
            What a beautiful Name it is
            The Name of Jesus Christ my King
            What a beautiful Name it is
            Nothing compares to this
            What a beautiful Name it is
            The Name of Jesus
            
            [Verse 2]
            You didn’t want heaven without us
            So Jesus You brought heaven down
            My sin was great Your love was greater
            What could separate us now
            
            [Chorus]
            What a wonderful Name it is
            What a wonderful Name it is
            The Name of Jesus Christ my King
            What a wonderful Name it is
            Nothing compares to this
            What a wonderful Name it is
            The Name of Jesus
            What a wonderful Name it is
            The Name of Jesus
            
            [Bridge]
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
            
            [Chorus]
            What a powerful Name it is
            What a powerful Name it is
            The Name of Jesus Christ my King
            What a powerful Name it is
            Nothing can stand against
            What a powerful Name it is
            The Name of Jesus`,

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

    "Bless The Lord": `
            Chorus
            Bless the Lord, O my soul,
            O my soul, worship His holy Name.
            Sing like never before, O my soul.
            I’ll worship Your holy Name.
            
            Verse 1
            The sun comes up, it’s a new day dawning;
            It’s time to sing Your song again.
            Whatever may pass and whatever lies before me,
            Let me be singing when the evening comes.
            
            Chorus
            Bless the Lord, O my soul,
            O my soul, worship His holy Name.
            Sing like never before, O my soul.
            I’ll worship Your holy Name.
            
            Verse 2
            You’re rich in love and You’re slow to anger,
            Your Name is great and Your heart is kind;
            For all Your goodness I will keep on singing,
            Ten thousand reasons for my heart to find.
            
            Chorus
            Bless the Lord, O my soul,
            O my soul, worship His holy Name.
            Sing like never before, O my soul.
            I’ll worship Your holy Name.
            
            Verse 3
            And on that day when my strength is failing,
            The end draws near and my time has come;
            Still my soul sings Your praise unending,
            Ten thousand years and then forevermore.
            
            Chorus
            Bless the Lord, O my soul,
            O my soul, worship His holy Name.
            Sing like never before, O my soul.
            I’ll worship Your holy Name.
            
            Bless the Lord, O my soul,
            O my soul, worship His holy Name.
            Sing like never before, O my soul.
            I’ll worship Your holy Name.
        `,

    "Trading my sorrows": `
            I’m Trading My Sorrows
            I’m Trading My Shame
            I’m Laying Them Down For The Joy Of The Lord
            I’m Trading My Sickness
            I’m Trading My Pain
            I’m Laying Them Down For The Joy Of The Lord
            And We’re Singing
            
            Yes Lord, Yes Lord, Yes Yes Lord
            Yes Lord, Yes Lord, Yes Yes Lord
            Yes Lord, Yes Lord, Yes Yes Lord, Amen
            
            I Am Pressed But Not Crushed,
            Persecuted Not Abandoned
            Struck Down But Not Destroyed
            I Am Blessed Beyond The Curse
            For His Promise Will Endure
            That His Joy Is Gonna Be My Strength
            Though The Sorrow May Last For The Night
            His Joy Comes In The Morning
            
            I’m Trading My Sorrows
            I’m Trading My Shame
            I’m Laying Them Down For The Joy Of The Lord
            I’m Trading My Sickness
            I’m Trading My Pain
            I’m Laying Them Down For The Joy Of The Lord
            And We’re Singing
            
            Yes Lord, Yes Lord, Yes Yes Lord
            Yes Lord, Yes Lord, Yes Yes Lord
            Yes Lord, Yes Lord, Yes Yes Lord, Amen
            
            And We’re Singing
            Yes Lord, Yes Lord, Yes Yes Lord
            Yes Lord, Yes Lord, Yes Yes Lord
            Yes Lord, Yes Lord, Yes Yes Lord, Amen
            
            Yes Lord, Amen
            Yes Lord, Amen!`
}
