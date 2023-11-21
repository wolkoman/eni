import {Collections} from "cockpit-sdk";

export function PersonSelector(props: {
    persons: Collections['person'][],
    person?: string,
    onChange: (id: string | null) => any
}) {

    //const {readerCount} = useAuthenticatedReaderStore();

    return <div>
        <div className="flex gap-2">
            <select value={props.person ?? ""}
                    onChange={({target}) => props.onChange(target.value ? target.value : null)}>
                <option value="">niemand</option>
                {props.persons
                    //.sort((a,b) => a.count - b.count)
                    .map(({name, _id: id}) => <option key={id} value={id}>{name}</option>)}
            </select>
        </div>
    </div>;
}
