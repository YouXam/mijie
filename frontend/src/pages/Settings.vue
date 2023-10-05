<template>
    <TitleCard title="账户设置">
        <template #subtitle><div class="mt-10"></div></template>
        <div class="form-control w-full max-w-xs flex flex-col m-auto">
            <label class="label">
                <span class="label-text">旧密码</span>
            </label>
            <input type="password" class="input input-bordered w-full max-w-xs" autocomplete="current-password" v-model="oldPassword"/>
            <label class="label">
                <span class="label-text">新密码</span>
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
            <button class="btn btn-accent" @click="register" :disabled="error.length || !password.length || !password2.length || password != password2">更改密码</button>
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
const router = useRouter()
const oldPassword = ref('')
const password = ref('')
const password2 = ref('')
const error = ref('')
if (!user.login.value) {
    localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
    router.replace('/login')
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
    const oldHash = await encryptPassword(oldPassword.value)
    const hash = await encryptPassword(password.value)
    try {
        await api('/api/change-password', {
            username: user.username.value,
            password: oldHash,
            newPassword: hash
        })
    } catch (err) {
        console.log(err)
    }
}
</script>