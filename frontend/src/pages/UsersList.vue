<template>
    <div>
        <div class="mx-auto text-center flex flex-col items-center justify-center">
            <div class="mt-10 mb-5">
                <h1 class="text-5xl font-extrabold tracking-tight mb-5 leading-tight">用户列表</h1>
                <div class="flex flex-row">
                    <button class="btn-link btn text-base-content" @click="recalculate">重新计算排行榜</button>
                    <router-link class="btn btn-link flex text-base-content" to="/record?all">提交记录</router-link>
                    <div class="dropdown">
                        <div tabindex="0" role="button" class="btn btn-link text-base-content">导出数据</div>
                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a @click="download('xlsx')">Excel 格式</a></li>
                            <li><a @click="download('csv')">csv 格式</a></li>
                            <li><a @click="download('txt')">txt 格式</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="px-3 w-full mt-5">
                <input type="text" placeholder="搜索..." class="input input-bordered w-full max-w-lg mb-4" v-model="search"/>
            </div>
            <div class="form-control w-[400px] mb-5">
                <label class="label cursor-pointer">
                    <span class="label-text mr-5">展开表格</span> 
                    <input type="checkbox" class="toggle toggle-sm" v-model="expand" />
                </label>
                <div class="flex">
                    <span class="label-text ml-1">每页数量</span> 
                    <span class="flex-1"></span>
                    <div>
                        <input type="range" min="0" max="100" v-model="xsize" class="range range-xs" step="25"/>
                        <div class="w-full flex justify-between text-xs px-2">
                            <span>10</span>
                            <span>30</span>
                            <span>50</span>
                            <span>100</span>
                            <span>∞</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full" v-if="expand">
                <Pagination v-if="searchedUsers.length && totalPages > 1"  class="my-5" :totalPages="totalPages" :currentPage="currentPage" @pageChange="onPageChange"/>
            </div>
            <div ref="card" class="card p-5 w-full rounded-none sm:rounded-2xl ">
                <div class="overflow-x-auto" :class="{'max-h-[calc(100vh-200px)]': !expand}" v-if="!loading">
                    <table class="table text-center table-pin-rows table-pin-cols" v-if="searchedUsers.length">
                        <thead>
                            <tr class="text-white">
                                <th ref="rankTh" style="z-index: 9999">排名</th>
                                <th :style="{ left: left + 'px' }" style="z-index: 9999">用户名</th>
                                <th>学号</th>
                                <td>题数</td>
                                <td>分数</td>
                                <td>通关</td>
                                <td>上次有效提交</td>
                                <td>备注</td>
                                <td v-for="problem in problems" :key="problem.pid">
                                    <router-link class="btn btn-sm btn-ghost normal-case select-text" :to="'/record/' + problem.pid + '?all'">{{ problem.name }}</router-link>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in pageedUsers" :key="user._id">
                                <th>{{ user.banned || user.hidden ? '*' : user.rank }}</th>
                                <th :style="{ left: left + 'px' }" class="p-0 px-1" style="z-index: 0">
                                    <div :class="{ tooltip: user.admin || user.banned, 'tooltip-right': user.admin || user.banned }" :data-tip="Object.entries({ '管理员': user.admin > 0, '已隐藏': user.hidden || user.banned, '已封禁': user.banned }).filter(x => x[1]).map(x => x[0]).join(', ')">
                                        <button :class="{ 'text-red-600': user.admin > 0, 'line-through': user.banned }"
                                            class="btn btn-sm btn-ghost normal-case select-text"
                                            @click="openDrawer(user)">
                                            {{ user.username}}</button>
                                    </div>

                                </th>
                                <td>{{ user.studentID }}</td>
                                <td>{{ user.passed || 0 }}</td>
                                <td>{{ user.points || 0 }}</td>
                                <td class="p-0">{{ user.gameover ? "是" : "" }}</td>
                                <td :class="{'min-w-[21ch]': user.lastPassed < 32503651200000 }">{{ user.lastPassed >= 32503651200000 ? "" : user.lastPassed.toLocaleString() }}</td>
                                <td>{{ user.remark }}</td>
                                <td v-for="problem in problems" :key="problem.pid">
                                    <router-link v-if="user.gameprocess[problem.pid]" :to="'/record/' + problem.pid + '?user=' + user.username" tag="button" class="btn btn-xs btn-ghost text-white">
                                        {{ user.gameprocess[problem.pid] }}
                                    </router-link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-else class="my-10">{{ search ? "无结果" : "暂无用户" }}</div>
                </div>
                <div v-else class="my-10">Loading...</div>
            </div>
            <div class="px-3 w-full z-10">
                <Pagination v-if="searchedUsers.length && totalPages > 1"  class="my-5" :totalPages="totalPages" :currentPage="currentPage" @pageChange="onPageChange"/>
            </div>
        </div>
        <button :disabled="loading2" v-if="!loading"
            class="btn btn-circle btn-success refresh text-white shadow-lg fixed bottom-3 right-5" @click="refresh(false)"
            :class="{ rotate: loading2 }">
            <font-awesome-icon :icon="['fas', 'arrows-rotate']" />
        </button>
        <div class="drawer drawer-end ">
            <input id="drawerw" type="checkbox" class="drawer-toggle" v-model="drawer" />
            <div class="drawer-side">
                <label for="drawerw" aria-label="close sidebar" class="drawer-overlay"></label>
                <div class="w-80 min-h-full bg-base-200 text-base-content">
                    <div class="h-[72px]"></div>
                    <div class="p-5">
                        <label for="drawerw" class="fixed right-2 drawer-button btn btn-circle btn-sm btn-ghost">
                            <font-awesome-icon :icon="['fas', 'xmark']" />
                        </label>
                        <h2 class="text-2xl text-center my-8">
                            {{ drawerUser.username }}
                        </h2>
                        
                        <div class="flex mb-4">
                            <div class="flex-1">学号</div>
                            <div>{{ drawerUser.studentID || '无' }}</div>
                        </div>
                        <div class="flex mb-4">
                            <div class="flex-1">管理员</div>
                            <input type="checkbox" class="toggle" ref="adminToggle"
                                :disabled="user.admin.value < 2 || user.username.value === drawerUser.username || drawerUser.banned"
                                :checked="drawerUser.admin > 0"
                                @click="put(1)"
                            />
                        </div>
                        <div class="flex mb-4">
                            <div class="flex-1">隐藏</div>
                            <input type="checkbox" class="toggle" :checked="drawerUser.hidden" @click="put(2)"/>
                        </div>
                        <div class="flex mb-4">
                            <div class="flex-1">封禁</div>
                            <input type="checkbox" class="toggle"
                                :checked="drawerUser.banned"
                                :disabled="(drawerUser.admin && drawerUser.admin > 0) || user.username.value === drawerUser.username"
                                @click="put(3)"/>
                        </div>
                        <div class="flex mb-2">
                            <div class="flex-1 mt-2">备注</div>
                            <input type="text" class="input input-bordered w-4/5" v-model="remark" @blur="put(4)"/>
                        </div>
                        <h3 class="text-xl text-center mt-8">
                            提交记录
                        </h3>                      
                        <ul class="menu bg-base-200 w-full rounded-box">
                            <li>
                                <router-link :to="'/record?user=' + encodeURIComponent(drawerUser.username)">全部提交记录</router-link>
                            </li>
                            <li v-for="problem in problems" :key="problem.pid">
                                <router-link :to="'/record/' + problem.pid + '?user=' + encodeURIComponent(drawerUser.username)">{{ problem.name }}  <span v-if="drawerUser.gameprocess?.[problem.pid] !== undefined">({{drawerUser.gameprocess[problem.pid]}} pts)</span></router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <table style="display: none;" ref="userlist">
            <thead>
                <tr>
                    <th>排名</th>
                    <th>用户名</th>
                    <th>账户信息</th>
                    <th>学号</th>
                    <td>题数</td>
                    <td>分数</td>
                    <td>通关</td>
                    <td>上次有效提交</td>
                    <td>备注</td>
                    <td v-for="problem in problems" :key="problem.pid">
                        {{ problem.name }}
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(user, index) in users" :key="user._id">
                    <th>{{ user.banned || user.hidden ? '*' : user.rank }}</th>
                    <th>{{ user.username}}</th>
                    <th>{{ [user.admin ? '管理员' : '', user.banned ? '已封禁' : '', user.hidden ? '已隐藏' : ''].filter(x => x).join(', ') }}</th>
                    <td>{{ user.studentID }}</td>
                    <td>{{ user.passed || 0 }}</td>
                    <td>{{ user.points || 0 }}</td>
                    <td>{{ user.gameover ? "是" : "" }}</td>
                    <td>{{ user.lastPassed >= 32503651200000 ? "" : user.lastPassed.toLocaleString() }}</td>
                    <td>{{ user.remark }}</td>
                    <td v-for="problem in problems" :key="problem.pid">{{ user.gameprocess[problem.pid] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
    
<script setup>
import TableExport from 'tableexport'
import { computed, reactive, ref, watch, onUnmounted } from 'vue'
import { api, apiPut } from '@/tools/api'
import { user, rankEventListener } from '@/tools/bus'
import { useRouter } from 'vue-router';
import notificationManager from '@/tools/notification.js'
import Pagination from '@/components/Pagination.vue'
const router = useRouter()
const users = ref([]);
const loading = ref(true)
const userlist = ref(null)
const loading2 = ref(false)
const problems = ref([])
const rankTh = ref(null)
const left = ref(0)
const drawer = ref(false)
const refDrawerUser = ref({})
const remark = ref('')
const adminToggle = ref(null)
const search = ref('')
const expand = ref(false)
function openDrawer(user) {
    drawer.value = true
    user.admin = user.admin || 0
    user.hidden = user.hidden || false
    user.banned = user.banned || false
    user.remark = user.remark || ''
    refDrawerUser.value = user
}
function recalculate() {
    api("/api/recalculate")
}
const drawerUser = computed(() => {
    return refDrawerUser.value || {}
})
watch(() => refDrawerUser?.value?.remark, () => {
    remark.value = refDrawerUser.value.remark
})
let lastUUID = null
function put(id) {
    const setValue = {}
    if (id == 1) {
        refDrawerUser.value.admin = !refDrawerUser.value.admin
        setValue.admin = refDrawerUser.value.admin ? 1 : 0
    } else if (id == 2) {
        refDrawerUser.value.hidden = !refDrawerUser.value.hidden
        setValue.hidden = refDrawerUser.value.hidden
    } else if (id == 3) {
        refDrawerUser.value.banned = !refDrawerUser.value.banned
        setValue.banned = refDrawerUser.value.banned
    } else if (id == 4) {
        if (refDrawerUser.value.remark == remark.value) return
        refDrawerUser.value.remark = remark.value
        setValue.remark = remark.value
    }
    const query = new URLSearchParams()
    query.set('username', refDrawerUser.value.username)
    apiPut('/api/user?' + query.toString(), setValue)
        .then(x => lastUUID = x.uuid)
        .catch(err => {
            if (err.status == 401) {
                localStorage.setItem("afterLogin", "/users")
                router.push("/login")
            }
            console.log(err)
        })
    if (id == 2 || id == 3) {
        users.value = calculateRank(users.value, true)
    }
}
function calculateRank(ranks, skipAssignment = false) {
    if (ranks.length > 0 && !ranks[0].__v_isReactive) 
        ranks = ranks.map(x => reactive(x))
    let rank = 1
    let last = -1;
    for (let i = 0; i < ranks.length; i++) {
        ranks[i].lastPassed = new Date(ranks[i].lastPassed)
        if (!skipAssignment && ranks[i].username === refDrawerUser.value.username) {
            refDrawerUser.value = ranks[i]
        }
        if (!ranks[i].hidden && !ranks[i].banned && last == -1) last = i;
    }
    if (last == -1) return ranks
    ranks[last].rank = rank
    for (let i = 1; i < ranks.length; i++) {
        if (ranks[i].hidden || ranks[i].banned) continue
        if (ranks[i].passed == ranks[last].passed && ranks[i].points == ranks[last].points && ranks[i].lastPassed.getTime() == ranks[last].lastPassed.getTime()) {
            ranks[i].rank = rank
        } else {
            ranks[i].rank = ++rank
        }
        last = i
        
    }
    return ranks
}

watch(rankTh, () => {
    if (!rankTh.value) return
    left.value = rankTh.value.offsetWidth
})
async function refresh(first = false, noNotification = false) {
    if (first) loading.value = true
    else loading2.value = true
    try {
        const [res, problemList] = await Promise.all([
            api("/api/users"),
            api("/api/problemList")
        ])
        problems.value = problemList.problems
        users.value = calculateRank(res.users)
        if (!first && !noNotification) {
            notificationManager.add({
                message: '刷新成功',
                type: 'success'
            })
        }
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem("afterLogin", "/users")
            router.push("/login")
        }
        console.log(err)
    } finally {
        if (first) loading.value = false
        else loading2.value = false
    }
}
refresh(true);
function notification(data) {
    if (data.detail.uuid != lastUUID)
        refresh(false, true)
}
rankEventListener.addEventListener('update', notification)
onUnmounted(() => {
  rankEventListener.removeEventListener('update', notification)
})

const xsize = ref(30)
const currentPage = ref(1)
function onPageChange(p) {
    currentPage.value = p
}
const size = computed(() => {
    if (xsize.value === '100') return 10000000000
    if (xsize.value === '75') return 100
    if (xsize.value === '50') return 50
    if (xsize.value === '25') return 30
    if (xsize.value === '0') return 10
    return xsize.value
})
const searchedUsers = computed(() => {
    if (!search.value) return users.value
    return users.value.filter(x => x.username.includes(search.value) || x.studentID?.includes(search.value))
})
const totalPages = computed(() => {
    return Math.ceil(searchedUsers.value.length / size.value)
})
const pageedUsers = computed(() => {
    return searchedUsers.value.slice((currentPage.value - 1) * size.value, currentPage.value * size.value)
})
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
}
function download(format) {
    const te = new TableExport(userlist.value, {
        formats: [format],
        filename: '用户列表_' + formatDate(new Date()),
        bootstrap: false,
        exportButtons: false,
        sheetname: "用户列表"
    });
    const exportData = te.getExportData()['tableexport-1'][format];
    te.export2file(exportData.data, exportData.mimeType, exportData.filename, exportData.fileExtension);

}
</script>
  
<style scoped>
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

.card {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0;
    box-shadow: 0 20px 50px rgba(255, 255, 255, 0.1);
    transition: all 0.1s;
    will-change: transform;
    color: #fff;
}</style>