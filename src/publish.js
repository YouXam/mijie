const Ably = require('ably');
require('dotenv').config();
const realtime = new Ably.Realtime({
    key: process.env.ABLY_API_KEY,
    transportParams: { heartbeatInterval: 10000 }
});

const rank = realtime.channels.get('rank');
const notice = realtime.channels.get('notice');

module.exports = { rank, notice };

