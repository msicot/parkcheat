const jwt_decode = require('jwt-decode');
const config = require('../config/default.json');
const nodeMailer = require('nodemailer');


function getDataAsUrlSearchParams(data) {
    const params = new URLSearchParams();
    for (var propt in data) {
        params.append(propt, data[propt]);
    }
    return params;
}

function getHeaders(token) {
    full_token = token.token_type + ' ' + token.access_token;
    return {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        'x-pbp-version': '2',
        'Content-Type': 'application/json',
        'Authorization': full_token,
        'X-Pbp-ClientType': 'WebApp',
        'Origin': 'https://m2.paybyphone.fr',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': 'https://m2.paybyphone.fr/',
    }
}

function decodeJwt(token) {
    const jwtToken = token.access_token;
    if (jwtToken) {
        try {
            decoded = jwt_decode(jwtToken);
            return decoded
        }
        catch (e) {
            return new Error(e);
        }

    }
}

function sendEmail(content, subject, to, from) {
    from = `"Nitram" <${config.gmail.email}>`; // sender address
    // to= config.email.to; // list of receivers

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: config.gmail.email,
            pass: config.gmail.password
        }
    });
    let mailOptions = {
        from: from, // sender address
        to: to, // list of receiver
        subject: subject, // subject line 
        text: content, // plain text body
        html: `<b>${content}</b>` // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return new Error(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}

module.exports = { getHeaders, getDataAsUrlSearchParams, decodeJwt, sendEmail }