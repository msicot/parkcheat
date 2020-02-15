const Queue = require('bull');


let redisUrl = null;
if (process.env.REDIS_URL) {
  redisUrl = process.env.REDIS_URL;
}
else{
    redisUrl = {
        redis:{
            host: '127.0.0.1',
            port: 6379        }
    }
}
const updateParkingSessionQueue = new Queue('syncingSession',redisUrl);
const onBoardNewUserQueue = new Queue('onBoardNewUser', redisUrl);

module.exports = {
    updateParkingSessionQueue,
    onBoardNewUserQueue
};

