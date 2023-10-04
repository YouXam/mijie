<template>
    <TitleCard :title="title" :minHeight="100">
        <!-- slot:subtitle -->
        <template #subtitle>
            <div class="flex flex-row items-center justify-center" v-if="score != null && score != undefined">
                <div class="flex flex-col items-center justify-center">
                    <div class="text-2xl font-bold">{{ score }} pts</div>
                </div>
            </div>
        </template>
        <div class="min-h-[100px] items-center justify-center flex flex-col">
            <Problem :content="problem"></Problem>
        </div>
    </TitleCard>
    <div class="mx-auto text-center flex flex-col items-center justify-center mb-20">
        <div class="card mt-10 mb-20">
            <textarea class="textarea textarea-white border-white" placeholder="输入答案" v-auto-expand></textarea>
            <button class="btn btn-outline mt-5">提交</button>
        </div>
    </div>
</template>
  
<script setup>
import TitleCard from '@/components/TitleCard.vue';
import { ref } from 'vue'
import { api } from '@/tools/api'
import { useRouter } from 'vue-router'
import { user } from '@/tools/bus'
import Problem from '@/components/Problem.vue'
const router = useRouter()
const title = ref('')
const problem = ref(`**Loading...**`)
const score = ref(null)
if (!user.login.value) {
    localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
    router.push('/login')
}
;(async function(){
    try {
        const res = await api('/api/problem/' + router.currentRoute.value.params.pid)
        title.value = res.name
        problem.value = res.description
        score.value = res.points
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
            router.push('/login')
        }
    }
})()
</script>

<style scoped>
.textarea {
    font-family: monospace;
}
.card {
    width: 800px;
    max-width: 80%;
}
</style>