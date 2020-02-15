const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required:true,
    },
    countryCode: {
        type: String,
        required: true
    },
    type: {
        type: String
    },
    id: {
        type: Number,
        required:true,
        unique: true
    },
    profileId: {
        type: String,
    },
    jurisdiction: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    }
});

const paymentAccountSchema = new mongoose.Schema({
    accountPaymentId: {
        type: String,
        required: true
    },
    maskedCardNumber: {
        type: String,
        required: true
    },
    paymentCardType: {
        type: String,
        required: true
    },
    nameOnCard: {
        type: String
    },
    expiryMonth: {
        type: Number,
        required: true
    },
    expiryYear: {
        type: Number,
        required: true
    },
    startMonth: {
        type: Date
    },
    startYear: {
        type: Date
    },
    issueNumber: {
        type: Number
    }
});

const rateOptionSchema = new mongoose.Schema({
    rateOptionId: {
        type: Number
    },
    type: {
        type: String
    }
});

const parkingSessionSchema = new mongoose.Schema({
    parkingSessionId: {
        type: String,
        required: true
    },
    locationId: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date
    },
    stall: {
        type: String
    },
    expireTime: {
        type: Date
    },
    vehicle: [vehicleSchema],
    rateOption: rateOptionSchema,
    isStoppable: {
        type: Boolean
    },
    fpsApplies: {
        type: Boolean
    },
    totalCost: {
        type: String
    },
    profileId:{
        type:String
    }

});

function validateVehicle(vehicle) {
    schema = Joi.object({
        licensePlate: Joi.string().min(1),
        countryCode: Joi.string().min(1),
        type: Joi.string(),
        vehicleId: Joi.string().min(1),
        profileId: Joi.string().min(1),
        jurisdiction: Joi.string().min(1),
    });
    return schema.validate(vehicle);
}

function validatePaymentAccount(paymentAccount) {
    schema = Joi.object({
        accountPaymentId: Joi.string().min(1), 
        maskedCardNumber: Joi.string().min(1),
        paymentCardType: Joi.string().min(1),
        nameOnCard: Joi.string(),
        expiryMonth: Joi.number().required().allow(null),
        expiryYear: Joi.number().required().allow(null),
        startMonth: Joi.date().required().allow(null),
        startYear: Joi.date().allow(null),
        issueNumber: Joi.number().allow(null)
    });
    return schema.validate(paymentAccount);
}

function validateParkingSession(parkingSession) {
    schema = Joi.object({
        parkingSessionId: Joi.string().min(1),
        locationId:  Joi.number().required(),
        startTime: Joi.date().required(),
        expireTime: Joi.date().required(),
        stall: Joi.allow(null),
        vehicle: Joi.object().keys({
            id: Joi.number().min(1),
            licensePlate: Joi.string().min(1),
            countryCode: Joi.string().min(1),
            type: Joi.string(),
            jurisdiction: Joi.string().allow('', null),
        }),
        rateOption: Joi.object().keys({
            rateOptionId: Joi.number().min(1),
            type: Joi.string().min(1)
        }),
        isStoppable: Joi.boolean(),
        fpsApplies: Joi.boolean(),
        totalCost: Joi.string().allow(null)
    });
    return schema.validate(parkingSession);
}

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
const PaymentAccount = mongoose.model('PaymentAccount', paymentAccountSchema);
const RateOption = mongoose.model('RateOption', rateOptionSchema);
const ParkingSession = mongoose.model('ParkingSession', parkingSessionSchema);

exports.Vehicle = Vehicle;
exports.PaymentAccount = PaymentAccount;
exports.RateOption = RateOption;
exports.ParkingSession = ParkingSession;

exports.validateVehicle = validateVehicle;
exports.validatePaymentAccount = validatePaymentAccount;
exports.validateParkingSession = validateParkingSession;
