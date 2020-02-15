const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { Profile } = require('../models/profile');
const {ParkingSession} = require('../models/pbpModels');
const {launchJob} = require('../worker/job');
const {sendEmail} = require('../scraping/tools');

router.get('/test', auth, async (req, res) => {
    user = req.user._id;
    let profile = await Profile.findOne({ user: user });
    if (!profile) return res.status(400).send("Profile not found");
    console.log("LAUNCH JOB")
    launchJob(profile);
    console.log("launchingJob done")
    const session = await ParkingSession.findOne({profileId:profile._id});
    console.log("PRINTING SESSION", session)
    if (session) sendEmail(session)
    return res.status(200).send({job:"sent"});

});

module.exports = router;