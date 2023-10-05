<template>
    <div class="container mx-auto text-center flex flex-col items-center justify-center">
        Loading...
    </div>
</template>
<script setup>
import { api } from '@/tools/api'
import { useRouter } from 'vue-router'
const router = useRouter()
;(async function(){
    try {
        const res = await api("/api/start")
        router.replace("/game/" + res.first)
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem("afterLogin", "/start")
            router.replace("/login")
        }
    }
})();
</script>