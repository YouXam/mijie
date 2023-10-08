<template>
    <div>
        <div class="mx-auto text-center flex flex-col items-center justify-center">
            <div class="mt-10 mb-5">
                <h1 class="text-5xl font-extrabold tracking-tight mb-5 leading-tight">用户列表</h1>
                <router-link class="btn btn-link flex text-base-content" to="/record?all">全部提交记录</router-link>
            </div>
            <div ref="card" class="card p-5 w-full rounded-none sm:rounded-2xl mb-20">
                <div class="overflow-x-auto" v-if="!loading">
                    <table class="table text-center">
                        <!-- head -->
                        <thead>
                            <tr class="text-white">
                                <th ref="rankTh">排名</th>
                                <th :style="{ left: left + 'px' }">用户名</th>
                                <td>学号</td>
                                <td>题数</td>
                                <td>分数</td>
                                <td>状态</td>
                                <td>备注</td>
                                <td v-for="problem in problems" :key="problem">{{ problem }}</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(user, index) in users" :key="user._id">
                                <th>{{ user.banned || user.hidden ? '*' : user.rank }}</th>
                                <th :style="{ left: left + 'px' }" class="p-0 px-1" style="z-index: 0">
                                    <div :class="{ tooltip: user.admin || user.banned }" :data-tip="Object.entries({ '管理员': user.admin > 0, '已隐藏': user.hidden || user.banned, '已封禁': user.banned }).filter(x => x[1]).map(x => x[0]).join(', ')">
                                        <button :class="{ 'text-red-600': user.admin > 0, 'line-through': user.banned }"
                                            class="btn btn-sm btn-ghost normal-case select-text"
                                            @click="openDrawer(user)">
                                            {{ user.username}}</button>
                                    </div>

                                </th>
                                <td>{{ user.studentID }}</td>
                                <td>{{ user.passed || 0 }}</td>
                                <td>{{ user.points || 0 }}</td>
                                <td class="p-0">{{ user.gameover ? "通关" : "" }}</td>
                                <td>{{ user.remark }}</td>
                                <td v-for="problem in problems" :key="problem">{{ user.gameprocess[problem] }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="mt-10">Loading...</div>
            </div>
        </div>
        <button :disabled="loading2" v-if="!loading"
            class="btn btn-circle btn-success refresh shadow-lg fixed bottom-3 right-5" @click="refresh(false)"
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
                            <input type="checkbox" class="toggle"
                                :disabled="user.admin.value < 2 || user.username.value === drawerUser.username"
                                :checked="drawerUser.admin"
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
                            <input type="text" class="input input-bordered" v-model="remark" @blur="put(4)"/>
                        </div>
                        <router-link class="btn btn-link flex text-base-content" :to="'/record?user=' + encodeURIComponent(drawerUser.username)">提交记录</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script setup>
import { computed, reactive, ref, watch, onUnmounted } from 'vue'
import { api, apiPut } from '@/tools/api'
import { user, rankEventListener } from '@/tools/bus'
import { useRouter } from 'vue-router';
import notificationManager from '@/tools/notification.js'
const router = useRouter()
const users = ref([]);
const loading = ref(true)
const loading2 = ref(false)
const problems = ref([])
const rankTh = ref(null)
const left = ref(0)
const drawer = ref(false)
const refDrawerUser = ref({})
const remark = ref('')
function openDrawer(user) {
    drawer.value = true
    refDrawerUser.value = user
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
    let rank = 1, _problems = {}
    let last = -1;
    for (let i = 0; i < ranks.length; i++) {
        if (!skipAssignment && ranks[i].username === refDrawerUser.value.username) {
            refDrawerUser.value = ranks[i]
        }
        for (let j in ranks[i].gameprocess || {}) {
            if (!_problems[j]) _problems[j] = 1
        }
        if (!ranks[i].hidden && !ranks[i].banned && last == -1) last = i;
    }
    if (last == -1) return ranks
    ranks[last].rank = rank
    for (let i = 1; i < ranks.length; i++) {
        if (ranks[i].hidden || ranks[i].banned) continue
        if (ranks[i].passed == ranks[last].passed && ranks[i].points == ranks[last].points) {
            ranks[i].rank = rank
        } else {
            ranks[i].rank = ++rank
        }
        last = i
        
    }
    problems.value = Object.keys(_problems).sort((a, b) => a.localeCompare(b))
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
        const res = await api("/api/users")
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