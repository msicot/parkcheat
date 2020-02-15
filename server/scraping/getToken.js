const colors = require('colors')
const axios = require('axios');
const config = require('../config/default.json');
const Cryptr = require('cryptr');

const { getHeaders, getDataAsUrlSearchParams } = require('./tools');
const { Profile } = require('../models/profile');

const BASEURL = 'https://api.paybyphone.com';

async function getToken(profile) {
    let pwd = new Cryptr(config.encryptKey).decrypt(profile.passwordPbp);
    data = {
        grant_type: 'password',
        username: '+33' + profile.phone,
        password: pwd,
        client_id: 'paybyphone_webapp'
    }
    headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Pbp-ClientType': 'WebApp',
        'Origin': 'https://m2.paybyphone.fr',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Referer': 'https://m2.paybyphone.fr/',
    }
    try {
        console.log("getToken 1")
        const response = await axios({
            method: 'POST',
            url: BASEURL + '/identity/token',
            data: getDataAsUrlSearchParams(data),
            headers: headers
        });
        return response.data
    }
    catch (e) {
        console.log("ERROR in getToken".red)
        throw new Error(e);
    }
}

module.exports = { getToken }