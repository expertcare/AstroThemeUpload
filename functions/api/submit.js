export async function onRequestPost(context) {
    var formData = await context.request.formData();
    const token = formData.get('cf-turnstile-response');
    const ip = context.request.headers.get('CF-Connecting-IP');
    // Validate the token by calling the "/siteverify" API.
    let frmData = new FormData();
    frmData.append('secret', "0x4AAAAAAACIF6ZjF2jLevUlUoTLGI-ivRk");
    frmData.append('response', token);
    formData.append('remoteip', ip);

    

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        body: frmData,
        method: 'POST',
    });

    const outcome = await result.json();
    if (outcome) {
        var data = {};
        data.name = formData.get('name');
        data.email = formData.get('email');
        data.message = formData.get('message');
        const baseId = "appoxjN0jp0EBWf7K";
        const apiKey = "patJCZ0a3FWPBZM6T.7047de97636b326ece6268c882843665edc6d9e0641238ce9817630719f39b8a";
        const tableName = "ContactForm";
        const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                fields: data
            })
        };

        try {
            const response = await fetch(url, options);
            const json = await response.json();
            if (response.status === 200) {
                sendEmail(data);
                let responseData = { message: "Success" };

                // Create a JSON response
                let response = new Response(JSON.stringify(responseData), {
                    headers: { 'content-type': 'application/json' },
                });
                return response;
            }
            else {
                let responseData = { message: json.error.message };

                let response = new Response(JSON.stringify(responseData), {
                    headers: { 'content-type': 'application/json' },
                });
                return response;
            }
        } catch (error) {
            let responseData = { message: error };

            let response = new Response(JSON.stringify(responseData), {
                headers: { 'content-type': 'application/json' },
            });
            return response;
            // return new Response(error, { status: 500 });
        }
    }
    else {
        let responseData = { message: "Turnstile Error" };

        let response = new Response(JSON.stringify(responseData), {
            headers: { 'content-type': 'application/json' },
        });
        return response;
    }
}


async function sendEmail(data) {
    let message = 'Name: ' + data.name;
    message += '<br />';
    message += 'Email: ' + data.email;
    message += '<br />';
    message += 'Message: ' + data.message;
    // Use the fetch() method to send the email
    await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            personalizations: [
                {
                    to: [{ email: 'hello@sunalgo.com', name: 'SunAlgo Website Inquiry' }],
                },
            ],
            from: {
                email: 'noreply@sunalgo.com',
                name: "SunAlgo Website Contact",
            },
            subject: 'SunAlgo Website Inquiry',
            content: [
                {
                    type: 'text/html',
                    value: message,
                },
            ],
        }),
    }).then(function (response) {
        // Do something with the response
        if (response.status === 200) {
            console.log("Email sent successfully")
        }
        else {
            console.log("Error occured while sending email")
        }
    }).catch(function (error) {
        console.log("Error: " + error);
    });
}