import { api } from '@/tools/api'

const keys = (async function() {
    const keys = await api("/api/keys")
    return keys;
})();

export async function getKeys() {
    return await keys;
}
