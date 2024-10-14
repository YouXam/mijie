<template>
    <p>「去年天枢通过哈士奇的博客搜集到了十分重要的情报。今年我们也不要落后！」PYthok 看上去斗志满满。</p>
    <p>「但是……哈士奇的博客有一个神奇的密码，好像是要回答AI提出的问题……」你有点迷糊，没明白这是什么加密手段。</p>
    <p>「我看一下。」PYthok 扫视了屏幕上一段又一段的规则。</p>
    <p>「我明白了。简单点说，这个密码的规则是要你『提出问题』，并诱导AI做出符合要求的回答。你来试试吧。」</p>
    <iframe :src="src" v-if="src"></iframe>
</template>

<style scoped>
p {
    margin: 0;
    margin-bottom: 1em;
}
iframe {
    border: none;
    height: calc(100vh - 100px);
    width: 100%;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue';
const origin = 'https://llm.chouhsing.org';
const api = inject('api')
const src = ref('');
function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
const token = localStorage.getItem("token")
const payload = JSON.parse(base64UrlDecode(token.split('.')[1]))
const user = payload.username
src.value = `${origin}/?user=${user}`
function listener(event) {
    if (event.origin === origin) {
        console.log(event.data)
        const { data } = event
        if (data.type === 'llm') {
            api('pass', {
                user,
                token: data.token
            })
        }
    }
}
onMounted(() => window.addEventListener('message', listener))
onUnmounted(() => window.removeEventListener('message', listener))
</script>
