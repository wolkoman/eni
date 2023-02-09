export function sendMail(templateId: number, toName: string, toMail: string, subject: string, variables: any) {
    return fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.MJ_PUBLIC + ":" + process.env.MJ_PRIVATE).toString('base64'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Messages: [
                {
                    To: [{Email: toMail, Name: toName}],
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