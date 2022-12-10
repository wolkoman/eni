import Site from '../components/Site';
import TopBar from '../components/TopBar';
import {EniBranding} from "../components/EniBranding";
import {ComingUp} from "../components/calendar/ComingUp";

export default function HomePage() {
    return <Site
            responsive={false} navbar={false}
            description="Drei Pfarren im Wiener Dekanat 23"
            keywords={["Katholisch", "Pfarre", "Glaube", "Gemeinschaft"]}>
            <TopBar />
            <EniBranding />
            <ComingUp/>
            {/*
            {isBeforeChristmas() && <ChristmasDisplay eventsObject={props.eventsObject} /> }
            <ComingUp/>
            <Personal />
            <Instagram items={props.instagram} />
            <EniSections />
            */}
        </Site>;
}