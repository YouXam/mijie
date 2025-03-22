import Ably from 'ably';
import { getKeys } from './keys';

const realtime = (async function() {    
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
    (await realtime)?.channels?.get(channel)?.subscribe("update", callback);
    console.log(`Subscribed to ${channel}`);
}