const colors = require('colors')
const axios = require('axios');
const { getHeaders } = require('./tools');
const BASEURL = 'https://api.paybyphone.com';
const { getToken } = require('./getToken');

async function getPermissionRes(profile, session) {
    try {
        const token = await getToken(profile);
        const headers = getHeaders(token);
        console.log(session)
        let location = session.locationId.toString();
        console.log("location", location)
        const response = await axios({
            method: 'GET',
            url: BASEURL + `/parking/locations/${location}/rateOptions`,
            headers: headers,
            params: {
                licensePlate: `${session.vehicle[0].licensePlate}`,
                parkingAccountId: `${profile.parkingAccountId}`
            }
        });
        if (response.status === 200) {
            for (let i = 0; i < response.data.length; i++) {
                data = response.data[i];
                if (data && data.type && data.type === 'RES') {
                    return true;
                }
            }
        } console.log("RETURNING false")

        return false;
    }
    catch (e) {

        throw new Error(e);
    }
}

module.exports = { getPermissionRes }