
const scrap = require('../../../scraping/index');
const { Profile } = require('../../../models/profile');
const { ParkingSession } = require('../../../models/pbpModels');

const config = require('../../../config/default.json');
const nodeMailer = require('nodemailer');
const {getToken} = require('../../../scraping/getToken');

async function takeAndPayParking()
{
    
}

async function jobOnBoardNewUser(data) {
    try {
        profile = await Profile.findById(data._id);
        if (!profile) {
            throw new Error("Unhandled missing profile");
        }
        console.log("PROCESSOR");

        const token = await scrap.getToken()
        console.log("PROCESSOR 1 getToken -> token", token );
        
        return token
    }
    catch (err) {
        return new Error("Unhandled error in tasks/Session/process.js", err);
    }
}

module.exports = { jobOnBoardNewUser }