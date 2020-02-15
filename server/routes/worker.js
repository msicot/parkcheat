const auth = require('../middleware/auth');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { Profile } = require('../models/profile');
const { launchJob } = require('../worker/job');
const { simple, clearDb } = require('../test/pbpTest');
const processor = require('../worker/tasks/Session/processor');
const { getToken } = require('../scraping/getToken');
const { getParkingAccount } = require('../scraping/getParkingAccount');
const { getPaymentAccount } = require('../scraping/getPaymentAccount');
const { getParkingSession } = require('../scraping/getSession');
const { syncAccount } = require('../scraping/syncAccount');
const { parkVehicle } = require('../scraping/parkVehicle');

const { getVehicle } = require('../scraping/getVehicle');
const colors = require('colors')

router.get('/jobtest2', auth, async (req, res) => {
    userId = req.user._id;
    console.log("job testing 2");
    try {
        let profile = await Profile.findOne({ user: userId });
        const token = await getToken(profile);
        console.log("TOKEN is OK".green);
        const parkingAccount = await getParkingAccount(profile, token);
        console.log("parkingAccount is OK".green)
        const paymentAccount = await getPaymentAccount(profile, token);
        console.log("paymentAccount is OK".green)
        const vehicle = await getVehicle(profile, token);
        console.log("Vehicle is OK".green, vehicle);
        const parkingSession = await getParkingSession(profile, token);
        console.log("ParkingSession is OK".green, parkingSession);
    }
    catch (error) {
        console.log(error.message.red)
        return res.status(400).send({ error: error.message })
    }
    //const cleardb = await clearDb()
    //launchJob(profile);
    res.status(200).send({ message: "Ongoing Sync of your account" });
});

router.get('/jobtest', auth, async (req, res) => {
    user = req.user._id;
    syncAccount(user)
    console.log("async code")
    return res.status(200).send({ sync: 'onGoing' });
});

router.get('/permission', auth, async (req, res) => {
    userId = req.user._id;
    let profile = await Profile.findOne({ user: userId });
    const response = await parkVehicle(profile, '', '');
    return res.status(200).send({status:response});
    

});

module.exports = router;