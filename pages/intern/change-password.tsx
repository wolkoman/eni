import React, {useState} from 'react';
import Site from '../../components/Site';
import {usePermission} from '../../util/use-permission';
import Button from '../../components/Button';
import {fetchJson} from '../../util/fetch-util';
import {useUserStore} from '../../util/use-user-store';

function Input(props: { label: string, value: string, onChange: (text: string) => any }) {
    return <div className="my-2">
        <div>{props.label}</div>
        <input className="px-4 py-2 rounded border border-gray-300 outline-none" value={props.value}
               onChange={(event) => props.onChange(event.target.value)} type="password"/>
    </div>;
}

export default function ChangePassword() {
    const [state, setState] = useState({current: '', neo: '', neoRepeat: '', loading: false});
    const jwt = useUserStore(store => store.jwt);
    usePermission([]);

    function save() {
        setState(x => ({...x, loading: true}));
        fetchJson('/api/change-password', {
            jwt,
            json: {password: state.current, neo: state.neo}
        }, {
            pending: 'Ändere Passwort',
            error: 'Passwort konnte nicht geändert werden',
            success: 'Passwort wurde geändert'
        }).catch(() => {}).finally(() => {
            setState({current: '', neo: '', neoRepeat: '', loading: false});
        });
    }

    return <Site title="Passwort ändern">
        <Input value={state.current} label="Aktuelles Passwort" onChange={(current) => setState(x => ({...x, current}))}/>
        <Input value={state.neo} label="Neues Passwort" onChange={(neo) => setState(x => ({...x, neo}))}/>
        <Input value={state.neoRepeat} label="Neues Passwort (wiederholen)" onChange={(neoRepeat) => setState(x => ({...x, neoRepeat}))}/>
        <Button label="Speichern" onClick={save}
                disabled={state.neo.length <= 4 || state.neo !== state.neoRepeat || state.current.length < 4 || state.loading}/>
    </Site>
}