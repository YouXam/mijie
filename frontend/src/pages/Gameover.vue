<template>
    <TitleCard title="游戏结束">
        <template #subtitle><div class="mt-10"></div></template>
        <div>
            <div class="min-h-[270px] flex flex-col justify-center items-center">
                游戏结束的剧情和提示
            </div>
            <router-link tag="button" to="/" class="btn btn-accent btn-outline mt-10 ">首页</router-link>
            <router-link tag="button" to="/graph" class="btn btn-accent btn-outline mt-10 ml-5">流程图</router-link>
            <router-link tag="button" to="/rank" class="btn btn-accent btn-outline ml-5 mt-10">排行榜</router-link>
        </div>
    </TitleCard>
</template>
  
  
<script setup>
import TitleCard from '@/components/TitleCard.vue'
import { useRouter } from 'vue-router'
import { user } from '@/tools/bus'
const router = useRouter()
if (!user.gameover.value) {
    if (history.state?.back) {
        router.replace(history.state?.back)
    }
    router.go(-1)
}
</script>

<style scoped>
* {
    font-family: "Neutraface Text", sans-serif;
}
</style>