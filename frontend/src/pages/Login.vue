<template>
    <TitleCard title="登录" :minHeight="100" class="mb-20">
        <template #subtitle><div class="mt-10"></div></template>
        <div class="form-control w-full max-w-xs flex flex-col m-auto mb-5">
            <label class="label">
                <span class="label-text">用户名</span>
            </label>
            <input type="text" class="input input-bordered w-full max-w-xs" autocomplete="username" v-model="username"/>
            <label class="label">
                <span class="label-text">密码</span>
            </label>
            <input type="password" class="input input-bordered w-full max-w-xs" autocomplete="current-password" v-model="password"/>
            <div id="cfTurnstile" class="cf-turnstile mt-5 ml-2" data-action="login" v-show="show_turnstile"></div>
            <button class="btn btn-accent mt-8" @click="login" :disabled="username.length == 0 || password.length < 8 || loading || show_turnstile && token.length == 0">
                <span class="loading loading-dots loading-xs" v-if="loading"></span>
                登录
            </button>
            <router-link tag="button" to="/register" class="btn btn-accent btn-outline mt-2">注册</router-link>
        </div>
    </TitleCard>
</template>
  
<script setup>
import TitleCard from '@/components/TitleCard.vue';
import { nextTick, ref } from 'vue'
import { encryptPassword } from '@/tools/crypto'
import { api } from '@/tools/api'
import { user } from '@/tools/bus'
import { useRouter } from 'vue-router'
import { getKeys } from '@/tools/keys'

import notificationManager from '@/tools/notification.js'
const router = useRouter()
const loading = ref(false)
if (user.login.value) {
    notificationManager.add({
        message: '您已登录，无需重复登录',
        type: 'info'
    })
    router.replace(history.state?.back?.path || '/')
}
const token = ref('')
const show_turnstile = ref(false)

;(async () => {
    const key = await getKeys()
    if (!key.turnstile) return;
    show_turnstile.value = true
    await loader.wait();
    turnstile.remove();
    turnstile.render('#cfTurnstile', {
        sitekey: key.turnstile,
        callback: (tk) => {
            token.value = tk;
        }
    });
})();

const username = ref('')
const password = ref('')
async function login() {
    loading.value = true
    const hash = await encryptPassword(password.value)
    try {
        const res = await api('/api/login', {
            username: username.value,
            password: hash,
            token: token.value
        })
        const afterLogin = localStorage.getItem("afterLogin")
        localStorage.removeItem("afterLogin")
        user.update();
        if (afterLogin && !afterLogin.startsWith('/login') && !afterLogin.startsWith('/register')) {
            router.push(afterLogin)
        } else {
            router.push('/')
        }
    } catch (err) {
        console.log(err)
        turnstile.reset()
    } finally {
        loading.value = false;
    }
}
</script>