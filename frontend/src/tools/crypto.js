export async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


export function shuffle(password) {
    const chars = password.split(''), a = 1664525, c = 1013904223, m = 2 ** 32;
    for (let i = 0, j, k = 0; i < password.length; i++) {
        k = (a * k + c + password.charCodeAt(i)) % m, j = k % chars.length;
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
}

export async function encryptPassword(password) {
    return await sha256(shuffle("4875c7y34nhj92u1m" + await sha256(shuffle("bupt_youxam_cc8x8uj2nkeji" + password + "baituan"))));
}