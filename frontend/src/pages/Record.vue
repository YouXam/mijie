<template>
    <div class="mx-10 text-center flex flex-col items-center justify-center mb-20">
        <h1 class="title text-5xl font-extrabold mt-10 mb-5 leading-tight">{{ problem.name }} 提交记录</h1>
        <h2 v-if="$route.query.user?.length">用户：{{ $route.query.user }}</h2>
        <router-link 
            tag="button"
            class="btn btn-link text-base-content mb-5"
            :to="`/game/${$route.params.pid}`"
            v-if="$route.params.pid && !$route.query.user"
        >返回题目</router-link>
        <template v-if="problem.manual && user.admin.value > 0 && router.currentRoute.value.params.pid && router.currentRoute.value.query.user">
            <div class="flex flex-col sm:min-w-[50%] min-w-full w-[500px] max-w-[90%]">
                <textarea class="mt-5 textarea" style="border-color: hsl(var(--bc) / 0.2)" placeholder="信息"
                    v-model="content"
                    v-auto-expand
                    @keydown.ctrl.enter="submit"
                ></textarea>
                <input type="text" placeholder="分数" class="block input input-bordered w-full mt-5" style="font-size: 0.875rem;" v-model="score"/>
                <button :disabled="loading2 || score.length === 0 || !/^\d+$/.test(score)" class="submit btn btn-outline mt-5 mb-5" @click="submit">
                    <span class="loading loading-dots loading-xs" v-if="loading2"></span>
                    提交
                </button>
            </div>
        </template>
        <Pagination v-if="records.length && totalPages > 1" :totalPages="totalPages" :currentPage="page" @pageChange="onPageChange"/>
        <template v-for="record in records" :key="record._id">
            <div 
                class="rounded-lg alert text-white mt-5 result text-left sm:min-w-[50%] min-w-full w-[500px] max-w-full"
                style="justify-items: normal"
                :class="{ 'alert-error': !record.passed, 'alert-success': record.passed}"
            >
                <div>
                    <h2 class="font-extrabold">
                        <template v-if="record.passed">
                            <font-awesome-icon :icon="['fas', 'circle-check']" />
                            答案正确
                        </template>
                        <template  v-else>
                            <font-awesome-icon  :icon="['fas', 'circle-xmark']" />
                            答案错误
                        </template>
                    </h2>
                    <div class="mt-2 text-gray-100">{{ formatDate(new Date(record.time)) }} {{ record.manualScores ? "由管理员手动评分" : "" }}</div>
                    <div class="mt-2 msg">
                        <div v-if="user.admin.value == 0"><span class="font-extrabold">用户: </span>{{ record.username }}</div>
                        <div v-else><span class="font-extrabold">用户: </span><router-link :to="'/record?user=' + encodeURIComponent(record.username)">{{ record.username }}</router-link></div>
                        <div v-if="user.admin.value == 0"><span class="font-extrabold">题目: </span>{{ record.name }}</div>
                        <div v-else><span class="font-extrabold">题目: </span><router-link :to="'/record/' + record.pid + '?all'">{{ record.username }}</router-link></div>
                        <div v-if="record.points != undefined"><span class="font-extrabold">分数: </span>{{ record.points }} <span v-if="record.gameover" class="font-extrabold">已通关</span></div>
                        <div v-if="!record.manualScores"><span class="font-extrabold">答案: </span><template v-if="record.ans?.length">{{ record.ans }}</template><span v-else class="italic">空</span></div>
                        <div v-if="record.msg?.length"><span class="font-extrabold">日志: </span>{{ record.msg }}</div>
                    </div>
                </div>
            </div>
        </template>
        <h1 v-if="!records.length && !loading" class="mt-10">暂无</h1>
        <h1 v-if="!records.length && loading" class="mt-10">Loading...</h1>
        <Pagination v-if="records.length && totalPages > 1"  class="mt-5" :totalPages="totalPages" :currentPage="page" @pageChange="onPageChange"/>
        <button
            :disabled="loading"
            class="btn btn-circle btn-success refresh shadow-lg fixed bottom-3 right-5"
            @click="update"
            :class="{rotate: loading}"
        >
            <font-awesome-icon :icon="['fas', 'arrows-rotate']" />
        </button>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { api } from '@/tools/api'
import { useRouter } from 'vue-router';
import { user } from '@/tools/bus'
import Pagination from '@/components/Pagination.vue'
import notificationManager from '@/tools/notification.js'
const router = useRouter()
const content = ref('')
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const records = ref([]);
const loading = ref(true);
const loading2 = ref(false);
const problem = reactive({ name: '', manual: false })
const page = ref(1);
const size =  10;
const score = ref('');
const totalPages = ref(1);
function onPageChange(p) {
    page.value = p
    update(true);
}
let first = true
async function submit() {
    try {
        loading2.value = true
        await api('/api/record/' + router.currentRoute.value.params.pid, {
            pid: router.currentRoute.value.params.pid,
            msg: content.value || undefined,
            points: parseFloat(score.value),
            username: router.currentRoute.value.query.user || undefined
        });
        content.value = ''
        score.value = ''
        update(true)
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
            router.push('/login')
        }
        console.log(err)
    } finally {
        loading2.value = false
    }
}
async function update(noNotification = false) {
    loading.value = true
    try {
        const query = new URLSearchParams()
        if (router.currentRoute.value.params.pid) {
            query.append('pid', router.currentRoute.value.params.pid)
            api("/api/problem/" + router.currentRoute.value.params.pid + "?simple=true").then(res => {
                problem.name = res.name
                problem.manual = res.manualScores
                document.title = res.name + ' 提交记录 | ' + document.title.split(' | ')[1]
            })
        }
        if (router.currentRoute.value.query.user) query.append('user', router.currentRoute.value.query.user)
        query.append('page', page.value)
        query.append('size', size)
        if (router.currentRoute.value.query.hasOwnProperty('all')) query.append('all', 'true')
        const res = await api('/api/record?' + query.toString())
        records.value = res.records
        totalPages.value = Math.ceil(res.total / size)
        if (!first && !noNotification) {
            notificationManager.add({
                message: '刷新成功',
                type: 'success'
            })
        }
        first = false
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
            router.push('/login')
        }
        console.log(err)
    } finally {
        loading.value = false
    }
}
update();
</script>

<style scoped>
div.msg div {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}


.title {
    font-family: "Neutraface Text", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.rotate {
  animation: rotate 2s linear infinite;
}
</style>