const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user:{
        type: String,
        required: true,
        minlength:4,
        unique:true
    },
    passwordPbp:{
        type: String,
        required: true,
        minlength: 4
    },
    phone :{
        type: String,
        minlength:10,
        maxlength:13,
        required:true
    },
    verified:{
        type:Boolean,
        default: false
    },
    dateVerified: {
        type: Date,
        default: Date.now
    },
    paymentAccount:{
        type:String
    },
    parkingAccountId:{
        type:String
    },
    memberId:{
        type:String,
    },
    activeUserAccount:{
        type:String,
    }
});

const Profile = mongoose.model('Profile', profileSchema);

function validateProfile(profile){
    schema = Joi.object({
        user: Joi.string().min(4),
        passwordPbp: Joi.string().min(4),
        phone: Joi.string().pattern(new RegExp('^(\\+33|0|0033)[6-7]\\d{8}$')),
    });
    return schema.validate(profile)
}
exports.Profile = Profile;
exports.validateProfile = validateProfile;