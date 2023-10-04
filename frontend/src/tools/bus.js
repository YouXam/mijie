import { ref } from 'vue'

class User {
    constructor() {
        this.update()
    }
    update() {
        const token = localStorage.getItem("token")
        if (token) {
            if (this.login) this.login.value = true
            else this.login = ref(true)
            const username = JSON.parse(atob(token.split('.')[1])).username
            if (this.username) this.username.value = username
            else this.username = ref(username)
        } else {
            if (this.login) this.login.value = false
            else this.login = ref(false)
            if (this.username) this.username.value = ''
            else this.username = ref('')
        }
    }
}

export const user = new User()