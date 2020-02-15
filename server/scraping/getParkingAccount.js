const colors = require('colors')
const axios = require('axios');
const { getHeaders } = require('./tools');
const BASEURL = 'https://api.paybyphone.com';

async function requestAccount(token) {
    console.log("getAccountPromise 2")
    headers = getHeaders(token);
    try {
        const response = await axios({
            method: 'GET',
            url: BASEURL + '/parking/accounts',
            headers: headers
        });
        return response.data
    }
    catch (e) {
        throw new Error(e);
    }
}

async function getParkingAccount(profile, token) {
    try {
        console.log("getParkingAccount 1")
        const data = await requestAccount(token);
        profile.parkingAccountId = data[0].id;
        profile = await profile.save()
        return profile
    }
    catch (e) {
        console.log("ERROR in getParkingAccount".red)
        throw new Error(e)
    }
}

module.exports = { getParkingAccount }