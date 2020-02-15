const colors = require('colors')

const { Profile } = require('../models/profile');
const { getToken } = require('./getToken');
const { getParkingAccount } = require('./getParkingAccount');
const { getPaymentAccount } = require('./getPaymentAccount');
const { getParkingSession } = require('./getSession');
const { getVehicle } = require('./getVehicle');
const { sendEmail } = require('./tools');

async function syncAccount(userId) {
    try {
        let profile = await Profile.findOne({ user: userId });
        const token = await getToken(profile);
        console.log("TOKEN is OK".green);
        const parkingAccount = await getParkingAccount(profile, token);
        console.log("parkingAccount is OK".green)
        const paymentAccount = await getPaymentAccount(profile, token);
        console.log("paymentAccount is OK".green)
        const vehicle = await getVehicle(profile, token);
        console.log("Vehicle is OK".green);
        const parkingSession = await getParkingSession(profile, token);
        console.log("ParkingSession is OK".green, parkingSession);
        if (parkingSession) {
            sendEmail(
                `Synchronisation de votre compte terminée.\nVotre parking se termine ${parkingSession.expireTime.toString()}.`, //content
                `Votre session de parking pour votre véhicule ${parkingSession.vehicle[0].licensePlate}.`);
        }
    }
    catch (e) {
        throw new Error(e);
    }
}

module.exports = { syncAccount }