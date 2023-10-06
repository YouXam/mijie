<template>
    <div class="mx-10 text-center flex flex-col items-center justify-center mb-20">
        <h1 class="title text-5xl font-extrabold mt-10 mb-5 leading-tight">{{ problem.name }} 提交记录</h1>
        <router-link 
            tag="button" 
            class="btn btn-link text-base-content mb-5"
            :to="`/game/${$route.params.pid}`"
            v-if="$route.params.pid"
        >返回题目</router-link>

        <Pagination :totalPages="totalPages" :currentPage="page" @pageChange="onPageChange"/>
        <template v-for="record in records" :key="record._id">
            <div 
                class="alert text-white mt-5 result text-left sm:min-w-[50%] min-w-full w-[500px] max-w-full"
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
                    <div class="mt-2 text-gray-100">{{ formatDate(new Date(record.time)) }}</div>
                    <div class="mt-2 msg">
                        <div><span class="font-extrabold">用户: </span>{{ record.username }}</div>
                        <div><span class="font-extrabold">题目: </span>{{ record.name }}</div>
                        <div v-if="record.points != undefined"><span class="font-extrabold">分数: </span>{{ record.points }} <span v-if="record.gameover" class="font-extrabold">已通关</span></div>
                        <div><span class="font-extrabold">答案: </span><template v-if="record.ans?.length">{{ record.ans }}</template><span v-else class="italic">空</span></div>
                        <div v-if="record.msg?.length"><span class="font-extrabold">日志: </span>{{ record.msg }}</div>
                    </div>
                </div>
            </div>
        </template>
        <h1 v-if="!records.length && !loading" class="mt-10">暂无</h1>
        <h1 v-if="!records.length && loading" class="mt-10">Loading...</h1>
        <Pagination class="mt-5" :totalPages="totalPages" :currentPage="page" @pageChange="onPageChange"/>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { api } from '@/tools/api'
import { useRouter } from 'vue-router';
import Pagination from '@/components/Pagination.vue'
const router = useRouter()
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
const problem = reactive({ name: '' })
const page = ref(1);
const size =  10;
const totalPages = ref(1);
function onPageChange(p) {
    page.value = p
    update();
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function update () {
    try {
        const query = new URLSearchParams()
        if (router.currentRoute.value.params.pid) {
            query.append('pid', router.currentRoute.value.params.pid)
            api("/api/problem/" + router.currentRoute.value.params.pid + "?simple=true").then(res => {
                problem.name = res.name
                document.title = res.name + ' 提交记录 | ' + document.title.split(' | ')[1]
            })
        }
        if (router.currentRoute.value.query.user) query.append('user', router.currentRoute.value.query.user)
        query.append('page', page.value)
        query.append('size', size)
        const res = await api('/api/record?' + query.toString())
        loading.value = false;
        records.value = res.records
        totalPages.value = Math.ceil(res.total / size)
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
            router.push('/login')
        }
        console.log(err)
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
</style>