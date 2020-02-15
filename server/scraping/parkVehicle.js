const { Profile } = require("../models/profile");
const { validateParkingSession, ParkingSession } = require('../models/pbpModels');
const { Vehicle, validateVehicle } = require('../models/pbpModels');
const { getToken } = require('./getToken');
const { requestParkingSession } = require('./getSession');
const { getPermissionRes } = require('./getPermissionRes');

async function parkVehicle(profile, vehicle, session) {
    session = await ParkingSession.findOne({ profileId: profile._id });
    try {
        const auth = await getPermissionRes(profile, session);
        if (auth === true) {
            //We have the possibility to park as RES
            console.log("parkIt(profile, vehicle, session);")
        }
    }
    catch (e) {
        throw new Error(e);
    }
}
async function getOnlineSession(profile) {
    try {
        const token = await getToken(profile);
        const onlineSession = await requestParkingSession(profile, token);
        return onlineSession
    }
    catch (e) {
        throw new Error(e);
    }

}

function isExpired(session) {
    const expireTime = session.expireTime.getTime()
    const now = new Date().getTime();
    return now < expireTime
}
async function manageNewParking(data) {
    try {
        // Supposed that the job is set sending the profile, vehicle concerned and session
        const profile = await Profile.findOne({ id: data.profile.id });
        const vehicle = await Vehicle.findOne({ id: data.vehicle.id });
        const session = await parkingSession.findOne({ id: data.parkingSession.parkingSessionId });
        const requestOnlineSession = getOnlineSession(profile);
        if (requestOnlineSession.status === 200 && requestOnlineSession.data) {
            for (let i = 0; i < requestOnlineSession.data.length; i++) {
                let data = requestOnlineSession.data[i];
                data.profileId = profile._id;
                const error = validateParkingSession(data) // TODO try without profileId for error testing
                //VERIFICATION
                let onlineSession = new ParkingSession(data);
                if (
                    vehicle.id !== onlineSession.vehicle.id
                    || onlineSession.rateOption.type !== 'RES'
                ) {
                    continue;
                }
                onlineSession = await onlineSession.save()
                programNewJob(profile, vehicle, onlineSession);
                return
            }
        }
        // No online session lets verify and PARK
        else {
            if (session.rateOption.type !== 'RES') throw new Error("CRITICAL ERROR TRYING TO PARK NON RES VEHICLE")
            if (isExpired(session) && vehicle.id === session.vehicle.id) {
                parkVehicle(profile, vehicle, session)
            }

        }
    }
    catch (e) {
        throw new Error(e);
    }
}

module.exports = { manageNewParking, parkVehicle }