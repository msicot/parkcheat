const colors = require('colors')
const { getHeaders } = require('./tools');
const { Vehicle } = require('../models/pbpModels');

const { validateParkingSession, ParkingSession } = require('../models/pbpModels');
const axios = require('axios');

var BASEURL = 'https://api.paybyphone.com';
async function updateVehicleStatus(vehicle) {
    try {
        for (let i = 0; i < vehicle.length; i++) {
            let vehicle = await Vehicle.findOne({ id: vehicle[i].id });
            if (vehicle) {
                vehicle.isActive = true;
                await vehicle.save()
            }
            else {
                throw new Error(e);
            }
        }
    }
    catch (e) {
        throw new Error(e);
    }
}
async function requestParkingSession(profile, token) {
    //console.log("requestParkingSession")
    try {
        const parkingId = profile.parkingAccountId;
        let headers = getHeaders(token);
        const response = await axios({
            method: 'GET',
            url: BASEURL + `/parking/accounts/${parkingId}/sessions`,
            headers: headers,
            params: {
                periodType: 'Current'
            }
        });
        return response
    }
    catch (e) {
        throw new Error(e);
    }
}

async function getParkingSession(profile, token) {
    try {
        const response = await requestParkingSession(profile, token);
        const data_set = response.data;
        if (!data_set){
            return
        }
        for (let i = 0; i < data_set.length; i++) {
            let data = data_set[i];
            if (data.rateOption.type != 'RES') {
                continue
            }
            const { error } = validateParkingSession(data);
            data.profileId = profile._id
            let parkingSession = await ParkingSession.findOne({ parkingSessionId: data.parkingSessionId })
            if (!parkingSession) {
                parkingSession = new ParkingSession(data);
                parkingSession = await parkingSession.save();
            }
            await updateVehicleStatus(parkingSession.vehicle)
            return parkingSession;
        }
    }
    catch (e) {
        console.log("Error in getParkingSession".red)
        throw new Error(e);
    }
}

module.exports = { getParkingSession, requestParkingSession }