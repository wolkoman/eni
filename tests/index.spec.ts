import { test, expect } from '@playwright/test';
import {cockpit} from "../util/cockpit-sdk";
import fs from 'fs'
import https from 'https'
test('get emmausboten', async ({ page }) => {
    test.setTimeout(120000);

    const papers = await cockpit.collectionGet("Emmausbote").then(({entries}) => entries);

    fs.writeFileSync("tests/data/emmausbote.json", JSON.stringify(papers));


    await papers.reduce<Promise<any>>((promise, paper) => promise.then(() => {
        console.log(paper.date);
        const targetFile = "tests/data/emmausbote-" + paper.date + "." + paper.preview.path.split(".").at(-1);
        if(fs.existsSync(targetFile)) return;
        return downloadFile("https://data.eni.wien/" + paper.preview.path, targetFile);
    }), Promise.resolve());

    console.log(papers);

});

export async function downloadFile (url: string, targetFile: string) {
    return await new Promise((resolve, reject) => {
        https.get(url, response => {
            const code = response.statusCode ?? 0

            if (code >= 400) {
                return reject(new Error(response.statusMessage))
            }

            // handle redirects
            if (code > 300 && code < 400 && !!response.headers.location) {
                return downloadFile(response.headers.location, targetFile)
            }

            // save the file to disk
            const fileWriter = fs
                .createWriteStream(targetFile)
                .on('finish', () => {
                    resolve({})
                })

            response.pipe(fileWriter)
        }).on('error', error => {
            reject(error)
        })
    })
}