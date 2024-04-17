import {response} from "msw";

export function sendMail(templateId: number, toName: string, toMail: string, subject: string, variables: any, sendViaBcc = false) {
    return fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.MJ_PUBLIC + ":" + process.env.MJ_PRIVATE).toString('base64'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Messages: [
                {
                    ...(sendViaBcc ? {To: [{Email: "admin@eni.wien", Name: "Kanzlei"}]} : {}),
                    [sendViaBcc ? 'Bcc' : 'To']: [{Email: toMail, Name: toName}],
                    TemplateID: templateId,
                    TemplateLanguage: true,
                    Subject: subject,
                    Variables: variables
                }
            ]
        })
    }).then(response => {
        if (!response.ok) {
            response.text().then(text => console.log("MJ_E", text))
            throw new Error("Mail not sent");
        }
        return response.json();
    }).then(response => console.log("MJ", response))

}

export function sendBulkMailV2(templateId: number, recipients: {
    mail: string,
    name: string,subject: string, variables: any
}[]) {
    const body = {
        Messages: recipients.map(recipient => ({
            From: {Email: "kanzlei@eni.wien", Name: "Pfarrkanzlei"},
            To: [{Email: recipient.mail, Name: recipient.name}],
            TemplateID: templateId,
            TemplateLanguage: true,
            Subject: recipient.subject,
            Variables: recipient.variables
        }))
    };
    console.log(JSON.stringify(body))
    return fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.MJ_PUBLIC + ":" + process.env.MJ_PRIVATE).toString('base64'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
      .then(response => {
        if (!response.ok) {
            response.text().then(text => console.log("MJ_E", text))
            throw new Error("Mail not sent");
        }
        return response.json();
    }).then(response => console.log("MJ", JSON.stringify(response)))
    return Promise.resolve()
}


export function sendBulkMail(templateId: number, recipients: {
    mail: string,
    name: string
}[], subject: string, variables: any, sendViaBcc = false) {
    return fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.MJ_PUBLIC + ":" + process.env.MJ_PRIVATE).toString('base64'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Messages: [
                {
                    ...(sendViaBcc ? {To: [{Email: "admin@eni.wien", Name: "Kanzlei"}]} : {}),
                    [sendViaBcc ? 'Bcc' : 'To']: recipients.map(({mail, name}) => ({Email: mail, Name: name})),
                    TemplateID: templateId,
                    TemplateLanguage: true,
                    Subject: subject,
                    Variables: variables
                }
            ]
        })
    }).then(response => {
        if (!response.ok) {
            response.text().then(text => console.log("MJ_E", text))
            throw new Error("Mail not sent");
        }
        return response.json();
    }).then(response => console.log("MJ", response))

}
