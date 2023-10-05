<template>
    <div>
        <TitleCard :title="title" :minHeight="100">
            <!-- slot:subtitle -->
            <template #subtitle>
                <div class="flex flex-row items-center justify-center" v-if="score != null && score != undefined">
                    <div class="flex flex-col items-center justify-center">
                        <div class="text-2xl font-bold">
                            {{ score }} pts 
                        </div>
                    </div>
                </div>
            </template>
            <div class="min-h-[100px] items-center justify-center flex flex-col">
                <Problem :content="problem"></Problem>
            </div>
            <FileList v-if="files.length" :files="files" @download="downloadFile"/>
        </TitleCard>
        <div class="mx-auto text-center flex flex-col items-center justify-center mb-20">

            <div class="card container">
                <template v-if="gameState == 1">
                    <textarea ref="ansInput" class="mt-5 textarea textarea-white " style="border-color: hsl(var(--bc) / 1)" placeholder="输入答案" v-model="ans"
                        v-auto-expand
                        @keydown.ctrl.enter="submit"
                    ></textarea>
                    <button class="submit btn btn-outline mt-5 mb-5" @click="submit" :disabled="loading">
                        <span class="loading loading-dots loading-xs" v-if="loading"></span>
                        提交
                    </button>
                </template>
            </div>
            <transition-group name="list">
                <template v-for="(record, index) in records" v-key="index">
                    <div class="container alert alert-error text-white mt-5 result" v-if="!record.passed">
                        <div>
                            <h2 class="font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" class="inline mb-1 stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                答案错误！
                            </h2>
                            <div class="mt-3" v-if="record.msg.length"><pre>{{ record.msg }}</pre></div>
                        </div>
                    </div>
                    <div class="container alert alert-success text-white mt-5 result" v-else>
                        <div>
                            <h2 class="font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" class="inline mb-1 stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                答案正确{{ record.points != undefined ? `，您得到了 ${record.points} pts！` : "！" }} {{ gameState == 3 ? "您已通关。": "" }}
                            </h2>
                            <div class="mt-3" v-if="record.msg.length"><pre>{{ record.msg }}</pre></div>
                        </div>
                    </div>
                </template>
            </transition-group>
            <Transition name="list">
                <div v-if="gameState == 2" class="card container">
                    <template v-if="next.length">
                        <h3 class="text-xl mt-5 text-left">下一关：</h3>
                        <NextList :next="next"/>
                    </template>
                    <h3 class="mt-5 text-left" v-else>似乎没有下一关了，要不要试试<router-link to="/graph" class="link">其他路线</router-link>？</h3>
                    <button class="btn btn-outline mt-5 mb-5" @click="gameState = 1, records = []">
                        再试一次
                    </button>
                </div>
            </Transition>
            <Transition name="list">
                <div v-if="gameState == 3" class="card container">
                    <button class="btn btn-outline mt-5" @click="gameState = 1, records = []">
                        再试一次
                    </button>
                    <button class="btn btn-outline mt-5 mb-5" @click="$router.push('/gameover')">
                        结束游戏
                    </button>
                </div>
            </Transition>
            <Transition name="down">
                <button class="btn btn-circle down shadow-lg fixed bottom-3 right-5" @click="down" :class="{'btn-success': state == 1, 'btn-error': state == 2}" v-if="showDown">
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M246.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 402.7 361.4 265.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-160 160zm160-352l-160 160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L224 210.7 361.4 73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3z" fill="white"/></svg>
                </button>
            </Transition>
            <router-link 
                tag="button" 
                class="btn btn-link text-base-content"
                :to="`/record/${$route.params.pid}`"
            >提交记录</router-link>
        </div>
    </div>
</template>
  
<script setup>
import TitleCard from '@/components/TitleCard.vue';
import { ref, computed, nextTick } from 'vue'
import { api, downloadFile as download } from '@/tools/api'
import { useRouter } from 'vue-router'
import { user } from '@/tools/bus'
import Problem from '@/components/Problem.vue'
import FileList from '@/components/FileList.vue'
import NextList from '@/components/NextList.vue'
const router = useRouter()
const title = ref('')
const problem = ref(`**Loading...**`)
const score = ref(null)
const ans = ref('')
const loading = ref(false)
const records = ref([])
const ansInput = ref(null)
const showDown = ref(false)
const files = ref([])
const next = ref([])
const gameState = ref(1)
let lastSubmit = null
const state = computed(() => {
    if (!records.value.length) return 0;
    if (records.value[0].passed) return 1;
    return 2;
})
if (!user.login.value) {
    localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
    router.push('/login')
}
function down() {
    const res = document.getElementsByClassName('result');
    if (!res.length) return;
    const rect = res[0].getBoundingClientRect();
    window.scrollTo({
        top: rect.top - 100,
        behavior: 'smooth'
    })
}
function downloadFile(file) {
    download(`/api/file/${router.currentRoute.value.params.pid}/${file}`, file)
}
function checkIfResultInViewport() {
    const res = document.getElementsByClassName('result');
    if (!res.length) return true
    const rect = res[0].getBoundingClientRect()
    return window.innerHeight > rect.bottom || rect.top < 100
}
document.addEventListener('scroll', () => {
    if (checkIfResultInViewport()) showDown.value = false
    else if (records.value.length) showDown.value = true
})
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function submit() {
    records.value = []
    lastSubmit = new Date()
    loading.value = true
    showDown.value = false
    try {
        const res = await api('/api/problem/' + router.currentRoute.value.params.pid, {
            ans: ans.value
        })
        await sleep(500 - new Date().getTime() + lastSubmit.getTime())
        records.value.unshift(res)
        if (res.passed) gameState.value = 2
        if (res.next) next.value = res.next
        if (res.gameover) gameState.value = 3
        nextTick(() => {
            if (!checkIfResultInViewport()) showDown.value = true
        })
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
            router.push('/login')
        }
    } finally {
        loading.value = false
    }
}
; (async function () {
    try {
        const res = await api('/api/problem/' + router.currentRoute.value.params.pid)
        title.value = res.name
        problem.value = res.description
        score.value = res.points
        if (res.files && res.files.length) files.value = res.files
        document.title = res.name + ' | ' + document.title.split(' | ')[1]
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
            router.push('/login')
        } else if (err.status == 404) {
            router.replace('/404')
        }
    }
})()
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.textarea {
    font-family: monospace;
}
.btn.submit, .textarea {
    animation: fadeIn var(--animation-duration, 0.5s) ease;
}
.textarea:focus {
    outline-color: hsl(var(--bc) / 1);
}
.container {
    width: 800px;
    max-width: 80%;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: none
}

pre {
    word-wrap: break-word;
    white-space: pre-wrap;
}

.down-enter-active,
.down-leave-active {
  transition: transform 0.5s ease;
}

.down-enter-from {
    transform: translateY(calc(0.75rem + 100%));
}

.down-enter-to {
    transform: translateY(0);
}

.down-leave-from {
  transform: translateY(0);
}
.down-leave-to {
  transform: translateY(calc(0.75rem + 100%));
}
.btn.down {
    animation: none;
}
</style>