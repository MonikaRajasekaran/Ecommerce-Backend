const AWS = require('aws-sdk');

const SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'ap-southeast-1',
};

const AWS_SES = new AWS.SES(SES_CONFIG);

let sendEmail = (recipientEmail, name) => {
    let params = {
        Source: '<email address you verified>',
        Destination: {
            ToAddresses: [
                recipientEmail
            ],
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: 'This is the body of my email!',
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `Hello, ${name}!`,
            }
        },
    };
    return AWS_SES.sendEmail(params).promise();
};

let sendTemplateEmail = (recipientEmail) => {
    let params = {
        Source: '<email address you verified>',
        Template: '<name of your template>',
        Destination: {
            ToAddresse: [
                recipientEmail
            ]
        },
        TemplateData: '{ \"name\':\'John Doe\'}'
    };
    return AWS_SES.sendTemplatedEmail(params).promise();
};

module.exports = {
    sendEmail,
    sendTemplateEmail,
};