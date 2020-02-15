const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('../config/default.json')
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type:String,
        minlength:1,
        maxlength:128,
        required:true
    },
    lastname: {
        type: String,
        minlength:1,
        maxlength:128,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required: true,
        minlength:4,
        maxlength:256
    },
    password:{
        type:String,
        required: true,
        minlength:4,
        maxlength: 2048
    },
});


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id:this._id}, config.jwtPrivateKey);
    return token    
}
const User = mongoose.model('user', userSchema);

function validateUser(user){
    const schema = Joi.object({
        firstname: Joi.string().min(1).max(120).required(),
        lastname: Joi.string().min(1).max(120).required(),
        email: Joi.string().email().min(4).max(256),
        password: Joi.string().min(4).max(2048)
    });
    return schema.validate(user)
}

exports.User = User;
exports.validateUser = validateUser;