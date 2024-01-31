<template>
    <span
        class="loading loading-lg text-base-content"
        :class="{'loading-spinner': !show_about, 'loading-infinity': show_about}"
    >
    </span>
    <p class="mt-5 text-base-content">{{ msg }}</p>
    <router-link to="/about" class="btn btn-link text-base-content" v-if="show_about">关于</router-link>
</template>

<script setup>
import { ref } from 'vue'

const msg = ref('加载中...')
const show_about = ref(false)
const msgLists = [
    '继续加载中...',
    '再等一下...',
    '再等一下就好了，真的...',
    '可能真的出错了，建议刷新重试或在下方反馈',
]

let i = 0;
let timeid = setInterval(() => {
    msg.value = msgLists[i]
    if (++i >= msgLists.length) {
        clearInterval(timeid)
        show_about.value = true
    }
}, 3000)

</script>