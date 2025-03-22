import Ably from 'ably';
import { getKeys } from './keys';

const client = (async function() {    
    const keys = await getKeys();
    if (!keys.ably) {
        console.error("No Ably key found");
        return;
    }
    return new Ably.Realtime({ 
        key: keys.ably,
        transportParams: { heartbeatInterval: 10000 }
    });
})();

export async function subscribe(channel, callback) {
    const realtime = await client;
    if (!realtime) return
    realtime.channels.get(channel).subscribe("update", callback);
    console.log(`Subscribed to ${channel}`);
}