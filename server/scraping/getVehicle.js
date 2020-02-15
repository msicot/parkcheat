const colors = require('colors')
const { getHeaders, decodeJwt } = require('./tools');
const { Vehicle, validateVehicle } = require('../models/pbpModels');
const axios = require('axios');

var BASEURL = 'https://api.paybyphone.com';

async function requestVehicle(profile, token) {
    //  console.log("Requesting vehicle...")
    try {
        let memberData = decodeJwt(token);
        let userAccount = memberData.activeuseraccount;
        let memberId = memberData.memberid;
        await profile.updateOne({ activeUserAccount: userAccount, memberId: memberId });
        let headers = getHeaders(token);
        const response = await axios({
            method: 'GET',
            url: BASEURL + `/identity/useraccounts/${userAccount}/vehicles`,
            headers: headers
        });
        return response
    }
    catch (e) {
        throw new Error(e);
    }
}

async function getVehicle(profile, token) {
    try {
        let vehicle_list = [];
        const response = await requestVehicle(profile, token);
        let data_set = response.data
        for (let i = 0; i < data_set.length; i++) {
            //console.log("Looping through vehicle");
            data = data_set[i];
            data.profileId = profile._id;
            let vehicle = await Vehicle.findOne({ id: data.id });
            if (vehicle) {
                vehicle_list.push(vehicle);
                continue;
            }
            const { error } = validateVehicle(data);
            vehicle = new Vehicle(data);
            vehicle.isActive = true;
            vehicle = await vehicle.save()
            vehicle_list.push(vehicle);
        }
        return vehicle_list;
    }
    catch (e) {
        console.log("Error in getVehicle".red);
        throw new Error(e);
    }
}

module.exports = { getVehicle }