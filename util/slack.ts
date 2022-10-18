import {fetchJson} from "./fetch-util";

const endpoints = ['chat.postMessage'] as const;
export async function slack(endpoint:  (typeof endpoints)[number], body: any) {
    return await fetchJson(`https://slack.com/api/${endpoint}`, {
        jwt: process.env.SLACK_TOKEN, json: body
    });
}