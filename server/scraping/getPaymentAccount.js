const axios = require('axios');
const _ = require('lodash')
const { getHeaders } = require('./tools');
const { PaymentAccount, validatePaymentAccount } = require('../models/pbpModels');

const BASEURL = 'https://api.paybyphone.com';

async function requestPaymentAccount(token) {
    try {
        console.log("PaymentAccountPromise 1")
        headers = getHeaders(token);
        // console.log("requesting payments account")
        const response = await axios({
            method: 'GET',
            url: BASEURL + '/payment/accounts',
            headers: headers
        });
        return response
    }
    catch (e) {
        throw new Error(e);
    }
}

async function getPaymentAccount(profile, token) {
    try {
        const response = await requestPaymentAccount(token);
        data = _.pick(response.data[0], [
            'maskedCardNumber', 'paymentCardType', 'nameOnCard',
            'expiryMonth', 'expiryYear', 'startMonth', 'startYear', 'issueNumber'
        ])
        data.accountPaymentId = response.data[0].id
        const { error } = validatePaymentAccount(data)
        if (profile.paymentAccount) {
            let paymentAccount = await PaymentAccount.findById(profile.paymentAccount).updateOne(data);
        }
        else {
            let paymentAccount = new PaymentAccount(data);
            paymentAccount = await paymentAccount.save();
            profile.paymentAccount = paymentAccount._id;
            profile = await profile.save();
        }
    }
    catch (e) {
        throw new Error(e);
    }
}

module.exports = { getPaymentAccount }