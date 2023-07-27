import React, {useRef, useState} from 'react';
import Site from '../components/Site';
import Button from "../components/Button";
import {toast} from "react-toastify";

function Signatur({signatur}: {signatur:{ address: string; mail: string; name: string; tel: string; position: string; parishes: { neustift: boolean; emmaus: boolean; inzersdorf: boolean } } }) {
  return <div style={{fontFamily: "Arial"}}>
    <div>
      <div style={{fontSize: 13, fontWeight: 'bold'}}>{signatur.name}</div>
      <div style={{fontSize: 12, fontStyle: 'italic'}}>{signatur.position}</div>
      {Object.values(signatur.parishes).some(x => x) && <div style={{fontSize: 12, fontStyle: ''}}>
        Pfarre{' '}
        {[
          signatur.parishes.emmaus ? 'Emmaus am Wienerberg' : null,
          signatur.parishes.inzersdorf ? 'Inzersdorf St. Nikolaus' : null,
          signatur.parishes.neustift ? 'Inzersdorf Neustift' : null,
        ].filter(x => !!x).join(', ')}

      </div>}
    </div>
    <br/>

    <div style={{fontSize: 12}}>
      {[
        signatur.mail ? <><a style={{color: '#2A6266'}}
                             href={`mailto:${signatur.mail}`}>{signatur.mail}</a> | </> : null,
        signatur.tel ? <><a style={{color: '#2A6266'}} href={`tel:${signatur.tel}`}>{signatur.tel}</a> | </> : null,
        <a style={{color: '#2A6266'}} href="https://eni.wien">www.eni.wien</a>
      ].filter(x => !!x)}
      {signatur.address && <div>{signatur.address}</div>}
      <div>
        <img alt="signatur"
            src="https://eni.wien/signatur.svg" width="500"/>
      </div>
    </div>
  </div>;
}

export default function HomePage() {

  const [signatur, setSignatur] = useState({
    name: 'Maximilian Mustermann',
    position: 'Position',
    parishes: {emmaus: true, inzersdorf: true, neustift: true},
    mail: 'kanzlei@eni.wien',
    tel: '+4366012345678',
    address: 'Draschestraße 105, 1230 Wien'
  });
  const divRef = useRef<HTMLDivElement>();

  function copy() {
      const type = "text/html";
      const blob = new Blob([divRef.current!.innerHTML], { type });
      const data = [new ClipboardItem({ [type]: blob })];

      navigator.clipboard.write(data).then(
          function () {
            toast("Signatur in Zwischenablage kopiert", {type: "success"});
          },
          function () {
            toast("Fehler beim Kopieren", {type: "error"});
          }
      );
  }


  return <Site title="Mail Signatur">
    <div className="text-lg font-bold">Daten</div>
    <div className="mb-12  grid md:grid-cols-2">
      <div><div className="opacity-80 text-sm mt-2">Name</div>
      <input
          className="px-2 py-1 border mb-1"
          value={signatur.name}
          onChange={(e) => setSignatur(x => ({...x, name: e.target.value}))}
      /></div>
      <div><div className="opacity-80 text-sm mt-2">Funktion</div>
      <input
          className="px-2 py-1 border mb-1"
          value={signatur.position}
          onChange={(e) => setSignatur(x => ({...x, position: e.target.value}))}
      /></div>
      <div><div className="opacity-80 text-sm mt-2">Mail Adresse</div>
      <input
          className="px-2 py-1 border mb-1"
          value={signatur.mail}
          onChange={(e) => setSignatur(x => ({...x, mail: e.target.value}))}
      /></div>
      <div><div className="opacity-80 text-sm mt-2">Telefon</div>
      <input
          className="px-2 py-1 border mb-1"
          value={signatur.tel}
          onChange={(e) => setSignatur(x => ({...x, tel: e.target.value}))}
      /></div>
      <div><div className="opacity-80 text-sm mt-2">Adresse</div>
      <input
          className="px-2 py-1 border mb-1"
          value={signatur.address}
          onChange={(e) => setSignatur(x => ({...x, address: e.target.value}))}
      /></div>
      <div><div className="opacity-80 text-sm mt-2">Pfarren</div>
      <input
          type="checkbox"
          className="px-2 py-1 border mb-1"
          checked={signatur.parishes.emmaus}
          onChange={(e) => setSignatur(x => ({...x, parishes: {...x.parishes, emmaus: e.target.checked}}))}
      />
      <input
          type="checkbox"
          className="px-2 py-1 border mb-1"
          checked={signatur.parishes.inzersdorf}
          onChange={(e) => setSignatur(x => ({...x, parishes: {...x.parishes, inzersdorf: e.target.checked}}))}
      />
      <input
          type="checkbox"
          className="px-2 py-1 border mb-1"
          checked={signatur.parishes.neustift}
          onChange={(e) => setSignatur(x => ({...x, parishes: {...x.parishes, neustift: e.target.checked}}))}
      /></div>
    </div>


    <div className="text-lg font-bold">Signatur</div>
    {/* @ts-ignore */}
    <div style={{padding: 20, border: "1px solid grey"}} ref={divRef}>
      <Signatur signatur={signatur}/>
    </div>

    <Button label={"In Zwischenablage kopieren"} onClick={() => copy()}></Button>


  </Site>
}