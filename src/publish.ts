import Ably from 'ably';
import dotenv from 'dotenv';
dotenv.config();
const realtime = new Ably.Realtime({
    key: process.env.ABLY_ADMIN_KEY,
    transportParams: { heartbeatInterval: 10000 }
});

export const rank = realtime.channels.get('rank');
export const notice = realtime.channels.get('notice');


