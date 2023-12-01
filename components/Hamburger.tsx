
export function Hamburger(props: {onClick?: () => any}) {
    return <div className="flex flex-col justify-center items-center md:hidden gap-2" onClick={props.onClick}>
        <div className="bg-black/60 h-1 w-6 rounded"/>
        <div className="bg-black/60 h-1 w-6 rounded"/>
    </div>;
}