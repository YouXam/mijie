import { ref } from 'vue'

class User {
    constructor() {
        this.update()
    }
    update() {
        const token = localStorage.getItem("token")
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]))
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

export const user = new User()