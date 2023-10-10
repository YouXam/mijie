<template>
    <TitleCard title="注册"  :minHeight="100" class="mb-20">
        <template #subtitle><div class="mt-10"></div></template>
        <div class="form-control w-full max-w-xs flex flex-col m-auto mb-5">
            <label class="label">
                <span class="label-text">用户名</span>
            </label>
            <input type="text" class="input input-bordered w-full max-w-xs" autocomplete="username" v-model="username"/>
            <label class="label">
                <span class="label-text">学号</span>
            </label>
            <input type="text" class="input input-bordered w-full max-w-xs" v-model="studentID" placeholder="领奖必须"/>
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
            <button class="btn btn-accent" @click="register" :disabled="error.length || !username.length  || (studentID.length > 0 && studentID.length != 10) || !password.length || !password2.length || password != password2">注册</button>
            <router-link tag="button" to="/login" class="btn btn-accent btn-outline mt-2">登录</router-link>
        </div>
    </TitleCard>
</template>
  
<script setup>
import TitleCard from '@/components/TitleCard.vue';
import { ref, watch } from 'vue'
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
    if (password.value.length < 16) {
        error.value = '密码长度不足 16 位'
    } else if (password.value.length > 128) {
        error.value = '密码长度超过 128 位'
    } else if (!password.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{16,128}$/)) {
        error.value = '密码必须包含大小写字母、数字和特殊符号'
    } else {
        error.value = ''
    }
})
async function register() {
    const hash = await encryptPassword(password.value)
    try {
        await api('/api/register', {
            username: username.value,
            studentID: studentID.value,
            password: hash
        })
        router.push('/login')
    } catch (err) {
        console.log(err)
    }
}
</script>