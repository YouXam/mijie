<template>
    <TitleCard title="登录">
        <div class="form-control w-full max-w-xs flex flex-col m-auto">
            <label class="label">
                <span class="label-text">用户名</span>
            </label>
            <input type="text" class="input input-bordered w-full max-w-xs" autocomplete="username" v-model="username"/>
            <label class="label">
                <span class="label-text">密码</span>
            </label>
            <input type="password" class="input input-bordered w-full max-w-xs" autocomplete="current-password" v-model="password"/>
            <button class="btn btn-accent mt-8" @click="login">登录</button>
            <router-link tag="button" to="/register" class="btn btn-accent btn-outline mt-2">注册</router-link>
        </div>
    </TitleCard>
</template>
  
<script setup>
import TitleCard from '@/components/TitleCard.vue';
import { ref } from 'vue'
import { encryptPassword } from '@/tools/crypto'
import { api } from '@/tools/api'
import { user } from '@/tools/bus'
import { useRouter } from 'vue-router'
import notificationManager from '@/tools/notification.js'
const router = useRouter()
if (user.login.value) {
    notificationManager.add({
        message: '您已登录，无需重复登录',
        type: 'info'
    })
    router.replace(history.state?.back?.path || '/')
}
const username = ref('')
const password = ref('')
async function login() {
    const hash = await encryptPassword(password.value)
    try {
        const res = await api('/api/login', {
            username: username.value,
            password: hash
        })
        const afterLogin = localStorage.getItem("afterLogin")
        user.update();
        if (afterLogin) {
            localStorage.removeItem("afterLogin")
            router.push(afterLogin)
        } else if (history.state?.back?.path) {
            if (!history.state.back.path.startsWith('/register') && !history.state.back.path.startsWith('/login'))
                router.push(history.state?.back?.path)
            else
                router.push('/')
        } else {
            router.push('/')
        }
    } catch (err) {
        console.log(err)
    }
}
</script>