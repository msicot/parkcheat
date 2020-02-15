const auth = require('../middleware/auth');
const config = require('../config/default.json')
const Cryptr = require('cryptr');
const express = require('express');
const router = express.Router();
const {Profile, validateProfile} = require('../models/profile');
const {User} = require('../models/users');
const _ = require('lodash');

// Delete profile
router.delete('/delete', auth, async (req, res) => {
    console.log("DELETE PROFILE");
    const profile = await Profile.findOne({user:req.user._id});
    if (!profile) return res.status(400).send("Profile does not exists");

    profile.delete();
    res.status(200).send("Profile deleted");
});
// create profile
router.post('/create', auth, async (req, res) => {
    console.log("CREATE PROFILE");
    req.body.user = req.user._id;
    const { error } = validateProfile(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let profile = await Profile.findOne({user:req.body.user});
    if (profile) return res.status(400).send("Profile already exists for your user");
    
    profile = new Profile(_.pick(req.body, ['user', 'passwordPbp', 'phone']));
    const cryptr = new Cryptr(config.encryptKey);
    profile.passwordPbp = cryptr.encrypt(profile.passwordPbp);
    profile = await profile.save();
    res.status(200).send(profile.user);
});

//update profile
router.post('/update', auth, async (req, res) => {
    console.log("UPDATE PROFILE");
    req.body.user = req.user._id;
    const { error } = validateProfile(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let profile = await Profile.findOne({user:req.user._id});
    if (!profile) return res.status(400).send("Profile not found");

    const cryptr = new Cryptr(config.encryptKey);
    decryptedPwd = cryptr.decrypt(profile.passwordPbp);
    
    console.log("Same ? ", decryptedPwd, req.body.passwordPbp, decryptedPwd === req.body.passwordPbp);
    if (decryptedPwd === req.body.passwordPbp) return res.status(400).send("Password must be different.");
    
    profile.passwordPbp = cryptr.encrypt(req.body.passwordPbp);
    profile = await profile.save();
    res.status(200).send({user:profile.user, message:"password updated"});
});

module.exports = router;