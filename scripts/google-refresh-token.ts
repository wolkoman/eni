require('dotenv').config();
const {google} = require('googleapis');
const fetch = require('node-fetch');
const internalDataId = "60d2474f6264631a2e00035c";

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_KEY,
    "https://eni.wien/api/google/callback"
);

(async () => {

    const entry = await fetch(`${process.env.COCKPIT_HOST}/api/collections/get/internal-data?[_id]=${internalDataId}&token=${process.env.COCKPIT_TOKEN}`).then(x => x.json()).then(x => x.entries[0]);
    const config = entry.data;
    const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_KEY,
    );
    oauth2Client.setCredentials(config);

    let newConfig = await oauth2Client.refreshToken(config.refresh_token).then(x => x.tokens).catch((response) => {
        process.exit(2);
    });
    newConfig = {...config, ...newConfig, expiry_date_string: new Date(newConfig.expiry_date).toISOString()}

    await fetch(`${process.env.COCKPIT_HOST}/api/collections/save/internal-data?token=${process.env.COCKPIT_TOKEN}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({data: {data: newConfig, id: 'google', _id: entry._id }})
    }).then(response => {
        process.exit(response.ok ? 0 : 1);
    });


})()


