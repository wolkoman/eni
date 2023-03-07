export function EniHero(props: {items: any[]}) {

    return <>

        <div className="bg-[url(/bg-login.svg)] bg-center bg-cover flex flex-col items-center"
             style={{backgroundImage: `aurl(${props.items[0]?.media_url})`}}>
            <div className="my-20">
                <div className="text-4xl lg:text-7xl font-bold my-4 text-center text-white relative">
                    Miteinander dreier Pfarren
                    <div className="absolute inset-0 text-4xl lg:text-7xl font-bold text-center text-stroke">
                        Miteinander dreier Pfarren
                    </div>
                    <div className="absolute inset-0 text-4xl lg:text-7xl font-bold text-center z-10">
                        Miteinander dreier Pfarren
                    </div>
                </div>
            </div>
            <img src="/logo/dreipfarren.svg" className="lg:h-[200px] z-20"/>
        </div>


    </>;
}