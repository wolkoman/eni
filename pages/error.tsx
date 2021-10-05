import React from 'react';
import Site from '../components/Site';
import Link from 'next/link';
import {useState} from '../util/use-state-util';

export default function ErrorPage() {
    const [errorMessage, setErrorMessage] = useState("Error");
    return <Site title="Custom error">
        <div>
            <input onChange={e => setErrorMessage(e.target.value)}/>
            <button onClick={() => {throw new Error(errorMessage)}}>Throw error</button>
        </div>
    </Site>
}