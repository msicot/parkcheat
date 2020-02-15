const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const {User} = require('../models/users');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');


router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email:req.body.email});
    if (!user) return res.status(400).send("Auth failed with this combination")
    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if (!validPwd) return res.status(400).send("Auth failed with this combination");
    
    const token = user.generateAuthToken();    
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'email']));
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().min(4).max(256),
        password: Joi.string().min(3).max(2048).required()
    })
    return schema.validate(req);
}

module.exports = router