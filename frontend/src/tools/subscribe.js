import Ably from 'ably';
const realtime = new Ably.Realtime({ key: 'vaMvyg.w_86lA:O_H4AyYenEZdC9BsNqRXll9dTayZku9MG12trP478ZA' });
export const rank = realtime.channels.get('rank');
export const notice = realtime.channels.get('notice');