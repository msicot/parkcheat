const { getHeaders, getDataAsUrlSearchParams } = require('./tools');
const config = require('../config/default.json');
const Cryptr = require('cryptr');
const { Profile } = require('../models/profile');
const { Vehicle, PaymentAccount, validatePaymentAccount, validateVehicle, validateParkingSession, ParkingSession } = require('../models/pbpModels');
const axios = require('axios');

const _ = require('lodash')
const jwt_decode = require('jwt-decode')
const BASEURL = 'https://api.paybyphone.com';

// to export as a whole to free space line in worker.js
const { getToken } = require('../scraping/getToken');
const { getParkingAccount } = require('../scraping/getParkingAccount');
const { getPaymentAccount } = require('../scraping/getPaymentAccount');
const { getParkingSession } = require('../scraping/getSession');
const { getVehicle } = require('./getVehicle');


module.exports = {
  getParkingSession
};