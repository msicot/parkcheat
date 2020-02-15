const Queue = require('bull');
const { jobOnBoardNewUser, jobSendEmail } = require('../worker/tasks/Session/processor');
const { Vehicle, PaymentAccount, validatePaymentAccount,
    validateVehicle, validateParkingSession, ParkingSession } = require('../models/pbpModels');

let redisUrl = null;
if (process.env.REDIS_URL) {
    redisUrl = process.env.REDIS_URL;
}
else {
    redisUrl = {
        redis: {
            host: '127.0.0.1',
            port: 6379
        }
    }
}

function launchJob(profile) {
    //const updateParkingSessionQueue = new Queue('syncingSession', redisUrl);
    const onBoardNewUserQueue = new Queue('onBoardNewUser', redisUrl);
    console.log("launching jobs.js")
    onBoardNewUserQueue.add({ profile: profile });
    onBoardNewUserQueue.process(async job => {
            try {
                console.log("trying jobOnBoardNewUser")
                const toDo = jobOnBoardNewUser(job.data.profile);
            }
            catch (err) {
                throw new Error(err);
            }
        });
}

/*
function launchJobSendEmail(profile) {
    const sendEmailQueue = new Queue('sendEmail', redisUrl);
    sendEmailQueue.add({profile:profile});
    sendEmailQueue.process( async job => {
        return new Promise(async (resolve, reject) => {
            if (!session) reject();
            else{
                try {
                    console.log("trying jobSendEmail")

                    jobSendEmail(job.data.profile);
                    resolve()
                }
                catch (err) {
                    reject(err);
                }
            }
        });
    });
}*/
module.exports = { launchJob };