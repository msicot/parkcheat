const {updateParkingSessionQueue, onBoardNewUserQueue} = require('../../queues/index');

async function addJobUpdateParkingSession(vehicleId) {
    return updateParkingSessionQueue.add(
        {vehcileId:vehicleId},
        {
            attempts:3
        }
    );
}
    
async function addJobOnboardNewUser(profile) {
    return onBoardNewUserQueue.add(
        {profile:profile},
        {
            attempts:3
        }
    )
}

module.exports = {
    addJobUpdateParkingSession,
    addJobOnboardNewUser
}