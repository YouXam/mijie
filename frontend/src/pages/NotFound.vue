<template>
    <div class="h-[calc(100vh-5rem)] text-center flex flex-col items-center justify-center">
        <h1 class="text-8xl">404</h1>
        <h1 class="text-7xl">Not Found</h1>
        <div>
            <button @click="goBack" class="btn btn-outline mt-10">返回</button>
            <router-link tag="button" to="/" class="btn btn-outline mt-10 ml-5">首页</router-link>
        </div>
    </div>
</template>
  
  
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goBack = () => {
    if (history.state?.back) {
        router.push(history.state?.back)
    } else {
        router.go(-1)
    }
}
</script>

<style scoped>
* {
    font-family: "Neutraface Text", sans-serif;
}
</style>