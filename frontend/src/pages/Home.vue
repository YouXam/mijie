<template>
    <div class="container mx-auto text-center h-[calc(100vh-72px)] flex flex-col items-center justify-center">
        <img src="/logo.png" alt="" class="sm:w-1/3 md:w-1/4 lg:w-1/6 mx-auto w-1/3">
        <div class="mt-10 relative">
            <h1 class="text-6xl sm:text-7xl font-extrabold tracking-tight gradient-text mb-10">
                哈士奇再现
            </h1>
            <div class="background w-full h-full absolute">
            </div>
        </div>
        <div class=" flex flex-col sm:w-1/3 w-2/3">
            <router-link to="/gamerule?start" tag="button" class="btn btn-ghost m-2 text-xl" @click.stop="start">开始游戏</router-link>
            <router-link to="/gamerule" tag="button" class="btn btn-ghost m-2 text-xl">游戏规则</router-link>
            <router-link to="/about" tag="button" class="btn btn-ghost m-2 text-xl">关于</router-link>
        </div>
    </div>
</template>
  
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function start() {
    if (localStorage.getItem('hasReadRule') !== null) router.push('/start');
    else router.push('/gamerule?start');
}
</script>
  
<style scoped>
.background {
    position: absolute;
    background-image: linear-gradient(-45deg, #f06d06 50%, #f200ff 50%);
    filter: blur(90px);
    top: 0;
    z-index: -1;
}
.gradient-text {
    background: linear-gradient(-45deg, #f06d06, #f200ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
  