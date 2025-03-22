import Ably from 'ably';
import dotenv from 'dotenv';
dotenv.config();

const realtime = process.env.ABLY_ADMIN_KEY ? new Ably.Realtime({
    key: process.env.ABLY_ADMIN_KEY,
    transportParams: { heartbeatInterval: 10000 }
}) : null;

const chanCache = new Map<string, ReturnType<Ably.Realtime['channels']['get']>>();

export const publish = (channelName: string, data: any) => {
    if (!realtime) return;
    let channel = chanCache.get(channelName)
    if (!channel) {
        channel = realtime.channels.get(channelName);
        chanCache.set(channelName, channel);
    }
    console.log('publishing', channelName, data);
    channel.publish('update', data);
}


