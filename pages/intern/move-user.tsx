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
    const [state, setState] = useState({neo: '', neoRepeat: '', loading: false});
    const [logout] = useUserStore(store => [store.logout]);
    usePermission([]);

    function save() {
        setState(x => ({...x, loading: true}));
        fetchJson('/api/move-user', {
            json: {neo: state.neo}
        }, {
            pending: 'Ändere Passwort',
            error: 'Passwort konnte nicht geändert werden',
            success: 'Passwort wurde geändert'
        }).then(() => {
            logout();
        }).catch(() => {}).finally(() => {
            setState({ neo: '', neoRepeat: '', loading: false});
        });
    }

    return <Site title="Passwort ändern">
        <div className=" my-8">
            <div className="text-lg font-bold">Sie müssen aus Sicherheitsgründen einmalig ihr Passwort ändern.</div>
            <div>Danach müssen Sie sich danach erneut anmelden.<br/>Bei Fragen, kontaktieren Sie Manuel Wolkowitsch (0680 216 82 77).</div>
        </div>
        <Input value={state.neo} label="Neues Passwort" onChange={(neo) => setState(x => ({...x, neo}))}/>
        <Input value={state.neoRepeat} label="Neues Passwort (wiederholen)" onChange={(neoRepeat) => setState(x => ({...x, neoRepeat}))}/>
        <Button label="Speichern" onClick={save} disabled={state.neo.length <= 4 || state.neo !== state.neoRepeat || state.loading}/>
    </Site>
}