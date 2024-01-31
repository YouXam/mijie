<template>
    <div class="mx-10 text-center flex flex-col items-center justify-center mb-20">
        <h1 class="title text-5xl font-extrabold mt-10 mb-5 leading-tight">
            <router-link v-if="problemSelect" class="link text-base-content mb-10 text-5xl h-[70px] normal-case font-extrabold" :to="`/game/${problemSelect}`">
                {{ problem.name }}
            </router-link>
            提交记录
        </h1>
        <div class="form-control" v-if="user.admin.value > 0">
            <label class="label cursor-pointer">
                <span class="label-text mr-5">显示所有用户</span> 
                <input type="checkbox" class="toggle" v-model="showall" @change="update"/>
            </label>
        </div>
        <div class="grid grid-cols-1  gap-4" :class="{ 'sm:grid-cols-3': user.admin.value > 0 && !showall, 'sm:grid-cols-2': !(user.admin.value > 0 && !showall)}">
            <label class="form-control w-full max-w-md" v-if="user.admin.value > 0 && !showall">
                <div class="label">
                    <span class="label-text">用户</span>
                </div>
                <input type="text" placeholder="输入完整用户名" v-model="username" class="input input-bordered w-full max-w-xs" @blur="update" @keydown.enter="update"/>
            </label>
            <label class="form-control w-full max-w-md">
                <div class="label">
                    <span class="label-text">题目</span>
                </div>
                <select class="select select-md select-bordered w-full max-w-xs" v-model="problemSelect" @change="update">
                    <option value="">全部</option>
                    <option v-for="problem in submitted_problems" :value="problem.pid">
                        {{ problem.name }} ({{ problem.count }})
                    </option>
                </select>
            </label>
            <label class="form-control w-full max-w-md">
                <div class="label">
                    <span class="label-text">状态</span>
                </div>
                <select class="select select-md select-bordered w-full max-w-xs" v-model="selected" @change="update">
                    <option>全部</option>
                    <option>正确</option>
                    <option>错误</option>
                </select>
            </label>
        </div>
        <div class="mt-5">
            共 {{ total }} 条记录
        </div>

        <template
            v-if="problem.manual && user.admin.value > 0 && problemSelect && username && !showall">
            <div class="flex flex-col sm:min-w-[50%] min-w-full w-[500px] max-w-[90%]">
                <textarea class="mt-5 textarea" style="border-color: hsl(var(--bc) / 0.2)" placeholder="信息"
                    v-model="content" v-auto-expand @keydown.ctrl.enter="submit"></textarea>
                <input type="text" placeholder="分数" class="block input input-bordered w-full mt-5"
                    style="font-size: 0.875rem;" v-model="score" />
                <button :disabled="loading2 || score.length === 0 || !/^\d+$/.test(score)"
                    class="submit btn btn-outline mt-5 mb-5" @click="submit">
                    <span class="loading loading-dots loading-xs" v-if="loading2"></span>
                    提交
                </button>
            </div>
        </template>

        <Pagination class="mt-5" v-if="records.length && totalPages > 1" :totalPages="totalPages" :currentPage="page"
            @pageChange="onPageChange" />
        <template v-for="record in records" :key="record._id">
            <div class="rounded-lg alert text-white mt-5 text-left sm:min-w-[50%] w-[500px] max-w-full" :class="{ 'alert-error': !record.passed, 'alert-success': record.passed }">
                <div class="sm:min-w-[calc(50vw-80px)] sm:w-[468px] w-full">
                    <h2 class="font-extrabold text-xl">
                        <router-link class="link" :to="'/game/' + record.pid">
                            <div class="tooltip" data-tip="已通关" v-if="record.gameover">
                                <font-awesome-icon  class="mr-1 text-amber-200" :icon="['fas', 'trophy']" />
                            </div>
                            {{ record.name }}
                        </router-link>
                        <div class="sm:float-right mt-2 sm:mt-0">
                            <template v-if="record.passed">
                                <font-awesome-icon class="mr-1" :icon="['fas', 'circle-check']" />
                                正确 
                            </template>
                            <template v-else>
                                <font-awesome-icon class="mr-1" :icon="['fas', 'circle-xmark']" />
                                错误
                            </template>
                            <span class="ml-2">{{ record.points ? record.points + ' pts' : '' }}</span>
                        </div>
                    </h2>
                    <div class="mt-2 text-gray-100">
                        <span v-if="user.admin.value == 0">{{ record.username }}</span>
                        <span v-else>
                            <router-link class="link" :to="'/record?user=' + encodeURIComponent(record.username)">
                                {{ record.username}}
                            </router-link>
                        </span> / 
                        {{ formatDate(new Date(record.time)) }} {{ record.manualScores ? " / 由管理员手动评分" : "" }}
                    </div>
                    <div class="mt-2 msg">
                        
                        <div v-if="!record.manualScores">
                            <span class="font-extrabold">答案: </span>
                            <template v-if="record.ans">
                                <div
                                    v-if="(typeof record.ans === 'string')"
                                    class="bg-opacity-30 bg-black m-2 p-2 rounded-md">
                                    <pre >{{ record.ans }}</pre>
                                </div>
                                <div v-else>
                                    <div v-for="(ans, i) in record.ans" :key="i" class="mx-2">
                                        <span class="font-bold">{{ i }}: </span>
                                        <pre v-if="ans" class="ml-5 bg-opacity-30 bg-black m-2 p-2 rounded-md">{{ ans }}</pre>
                                        <span v-else class="italic">空</span>
                                    </div>
                                </div>
                            </template>
                            <span v-else class="italic">空</span></div>
                        <div v-if="record.msg?.length"><span class="font-extrabold">信息: </span>
                            <div class="max-w-full bg-opacity-30 bg-black m-2 p-2 rounded-md">
                                <pre>{{ record.msg }}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <h1 v-if="!records.length && !loading" class="mt-10">暂无</h1>
        <h1 v-if="!records.length && loading" class="mt-10">Loading...</h1>
        <Pagination v-if="records.length && totalPages > 1" class="mt-5" :totalPages="totalPages" :currentPage="page"
            @pageChange="onPageChange" />
        <button :disabled="loading" class="btn btn-circle btn-success refresh shadow-lg fixed bottom-3 right-5"
            @click="update" :class="{ rotate: loading }">
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
const selected = ref(router.currentRoute.value.query.passed === undefined ? '全部' : 
router.currentRoute.value.query.passed === 'true' ? '正确' : '错误')
const problemSelect = ref(router.currentRoute.value.params.pid === undefined? '' : router.currentRoute.value.params.pid)
const showall = ref(router.currentRoute.value.query.all !== undefined)
const username = ref(router.currentRoute.value.query.user === undefined? user.username.value : router.currentRoute.value.query.user)
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
const size = 10;
const score = ref('');
const inputs = ref([]);
const totalPages = ref(1);
const total = ref(0);
function onPageChange(p) {
    page.value = p
    update(true);
}
let first = true
const submitted_problems = ref([])
async function submit() {
    try {
        loading2.value = true
        if (!problemSelect.value) return
        await api('/api/record/' + problemSelect.value, {
            pid: problemSelect.value,
            msg: content.value || undefined,
            points: parseFloat(score.value),
            username: username.value
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
        if (problemSelect.value) {
            query.append('pid', problemSelect.value)
            api("/api/problem/" + problemSelect.value + "?simple=true").then(res => {
                problem.name = res.name
                problem.manual = res.manualScores
                document.title = res.name + ' 提交记录 | ' + document.title.split(' | ')[1]
                inputs.value = res.inputs
            })
        } else {
            document.title = '提交记录 | ' + document.title.split(' | ')[1]
        }
        if (username.value && !showall.value) query.append('user', username.value)
        query.append('page', page.value)
        query.append('size', size)
        if (selected.value !== '全部') query.append('passed',  selected.value == '正确')
        if (showall.value) query.append('all', 'true')
        const query2 = new URLSearchParams()
        if (username.value && !showall.value) query2.append('username', username.value)
        const [res, res2] = await Promise.all([
            api('/api/record?' + query.toString()),
            api('/api/submitted_problems?' + query2.toString())
        ])
        submitted_problems.value = res2.submitted_problems
        records.value = res.records
        total.value = res.total
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
    font-family: "Neutraface Text", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    ;
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

pre {
    word-wrap: break-word;
    white-space: pre-wrap;
}

</style>