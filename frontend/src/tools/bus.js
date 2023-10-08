import { ref } from 'vue'

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

class User {
    constructor() {
        this.update()
    }
    update() {
        const token = localStorage.getItem("token")
        if (token) {
            const payload = JSON.parse(base64UrlDecode(token.split('.')[1]))
            this.set('login', true)
            this.set('username', payload.username)
            this.set('admin', payload.admin || 0)
            this.set('gameover', payload.gameover || false)
            this.set('points', Object.values(payload.gameprocess || {}).reduce((a, b) => a + b, 0))
        } else {
            this.set('login', false)
            this.set('username', '')
            this.set('gameover', false)
            this.set('points', 0)
            this.set('admin', 0)
        }
    }
    set(key, value) {
        if (this[key]) this[key].value = value
        else this[key] = ref(value)
    }
}

export const noticeEventListener = new EventTarget();

export const rankEventListener = new EventTarget();

export const user = new User()