<template>
    <TitleCard title="注册"  :minHeight="100" class="mb-20">
        <template #subtitle><div class="mt-10"></div></template>
        <div class="form-control w-full max-w-xs flex flex-col m-auto mb-5">
            <label class="label">
                <span class="label-text">用户名</span>
            </label>
            <input type="text" class="input input-bordered w-full max-w-xs" autocomplete="username" v-model="username"/>
            <!-- <label class="label">
                <span class="label-text">学号</span>
            </label>
            <input type="text" class="input input-bordered w-full max-w-xs" v-model="studentID" placeholder="领奖必须"/> -->
            <label class="label">
                <span class="label-text">密码</span>
            </label>
            <input type="password" class="input input-bordered w-full max-w-xs" autocomplete="new-password" v-model="password"/>
            <label class="label">
                <span class="label-text-alt"></span>
                <span class="label-text-alt text-red-400 transition-opacity" :class="{ 
                    'opacity-0': !error.length,
                    'opacity-100': error.length
                }">{{ error }}</span>
            </label>
            <label class="label -mt-3 block text-left">
                <span class="label-text">重复密码</span>
            </label>
            <input type="password" class="input input-bordered w-full max-w-xs" autocomplete="new-password" v-model="password2"/>
            <label class="label">
                <span class="label-text-alt"></span>
                <span class="label-text-alt text-red-400 transition-opacity" :class="{ 
                    'opacity-0': !password2.length || password2 == password,
                    'opacity-100': password2.length && password2 != password
                }">密码不匹配</span>
            </label>
            <div id="cfTurnstile" class="cf-turnstile ml-2" data-sitekey="0x4AAAAAAAQoQYZbX4vkrZir" data-action="register"></div>
            <button class="btn btn-accent mt-5" @click="register"
                :disabled="token.length === 0 || loading || error.length || !username.length  || (studentID.length > 0 && studentID.length != 10) || !password.length || !password2.length || password != password2">
                <span class="loading loading-dots loading-xs" v-if="loading"></span>
                注册 
            </button>
            <router-link tag="button" to="/login" class="btn btn-accent btn-outline mt-2">登录</router-link>
        </div>
    </TitleCard>
</template>
  
<script setup>
import TitleCard from '@/components/TitleCard.vue';
import { ref, watch, nextTick } from 'vue'
import { encryptPassword } from '@/tools/crypto'
import { api } from '@/tools/api'
import { useRouter } from 'vue-router'
import { user } from '@/tools/bus'
import notificationManager from '@/tools/notification.js'
const router = useRouter()
const username = ref('')
const studentID = ref('')
const password = ref('')
const password2 = ref('')
const error = ref('')
const token = ref('')
const loading = ref(false)
nextTick(() => {
    turnstile.render('#cfTurnstile', {
        sitekey: '0x4AAAAAAAQoQYZbX4vkrZir',
        callback: (tk) => {
            token.value = tk;
        }
    });
})

if (user.login.value) {
    notificationManager.add({
        message: '您已登录',
        type: 'info'
    })
    router.replace(history.state?.back?.path || '/')
}
watch(password, () => {
    if (!password.value.length) {
        error.value = ''
        return
    }
    const hasUppercase = /[A-Z]/.test(password.value);
    const hasLowercase = /[a-z]/.test(password.value);
    const hasDigits = /\d/.test(password.value);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password.value);

    const isValid = [hasUppercase, hasLowercase, hasDigits, hasSpecial].filter(Boolean).length >= 3;
    if (password.value.length < 8) {
        error.value = '密码长度不足 8 位'
    } else if (password.value.length > 128) {
        error.value = '密码长度超过 128 位'
    } else if (!isValid) {
        error.value = '密码必须包含大小写字母、数字和特殊符号中的三项及以上'
    } else {
        error.value = ''
    }
})
async function register() {
    loading.value = true
    const hash = await encryptPassword(password.value)
    try {
        await api('/api/register', {
            username: username.value,
            studentID: studentID.value,
            password: hash,
            token: token.value
        })
        router.push('/login')
    } catch (err) {
        console.log(err)
    } finally {
        loading.value = false
    }
}
</script>