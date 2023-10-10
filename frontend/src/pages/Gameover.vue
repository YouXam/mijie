<template>
    <TitleCard title="游戏结束" class="mb-20" :minHeight="100">
        <template #subtitle><div class="mt-10"></div></template>
        <div class="px-5 pt-5">
            <Problem :content="gameover" v-if="gameover.length"></Problem>
            <div v-else>
                空
            </div>
            <router-link tag="button" to="/" class="btn btn-accent btn-outline mt-10 ">首页</router-link>
            <router-link tag="button" to="/graph" class="btn btn-accent btn-outline mt-10 ml-5">流程图</router-link>
            <router-link tag="button" to="/rank" class="btn btn-accent btn-outline ml-5 mt-10">排行榜</router-link>
        </div>
    </TitleCard>
</template>
  
  
<script setup>
import TitleCard from '@/components/TitleCard.vue'
import Problem from '@/components/Problem.vue'
import { useRouter } from 'vue-router'
import { user } from '@/tools/bus'
import { api } from '@/tools/api'
import { ref } from 'vue'
const router = useRouter()
const gameover = ref('')
if (!user.gameover.value) {
    if (history.state?.back) {
        router.replace(history.state?.back)
    }
    router.go(-1)
}
api('/api/game-config/gameover').then(res => {
    gameover.value = res.gameover
})

</script>

<style scoped>
* {
    font-family: "Neutraface Text", sans-serif;
}
</style>