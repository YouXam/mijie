<template>
  <div class="mb-20">
    <TitleCard title="排行榜">
      <template #subtitle>
        <div class="mt-10">
          <font-awesome-icon :icon="['fas', 'circle-info']" />
          按照分数降序、题数降序、上次有效提交时间升序排序，全部相同者排名相同。
        </div>
      </template>
      <div class="overflow-x-auto" v-if="!loading">
        <table class="table " v-if="rank.length">
          <!-- head -->
          <thead>
            <tr class="text-white">
              <th>排名</th>
              <th>用户名</th>
              <th>题数</th>
              <th>分数</th>
              <th>
                <div class="tooltip tooltip-bottom" data-tip="有效提交指首次通过提交">
                  上次有效提交
                </div>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-base-200" v-if="!currentUser.hidden">
              <th>{{ currentUser.rank }}</th>
              <td>{{ currentUser.username }}</td>
              <!-- <td v-if="!currentUser.noPrize">{{ currentUser.username }}</td>
              <td v-else>
                <div class="tooltip tooltip-right text-gray-400" data-tip="无评奖资格">
                  {{ currentUser.username }}
                </div>
              </td> -->
              <td>{{ currentUser.passed }}</td>
              <td>{{ currentUser.points }}</td>
              <td :class="{'min-w-[21ch]': currentUser.lastPassed < 32503651200000 }">{{ currentUser.lastPassed >= 32503651200000 ? "" : currentUser.lastPassed.toLocaleString() }}</td>
              <td :class="{'min-w-[14ch]': currentUser.gameover }">
                <div v-if="currentUser.gameover" >
                  <font-awesome-icon class="mr-1 text-amber-200" :icon="['fas', 'trophy']" /> 已通关
                </div>
              </td>
            </tr>
            <tr v-for="(user, index) in rank" :key="user.username">
              <th>{{ user.rank }}</th>
              <td>{{ user.username }}</td>
              <!-- <td v-if="!user.noPrize">{{ user.username }}</td>
              <td v-else>
                <div class="tooltip tooltip-right text-gray-400" data-tip="无评奖资格">
                  {{ user.username }}
                </div>
              </td> -->
              <td>{{ user.passed }}</td>
              <td>{{ user.points }}</td>
              <td :class="{'min-w-[21ch]': user.lastPassed < 32503651200000 }">{{ user.lastPassed >= 32503651200000 ? "" : user.lastPassed.toLocaleString() }}</td>
              <td :class="{'min-w-[10ch]': user.gameover }">
                <div v-if="user.gameover">
                  <font-awesome-icon  class="mr-1 text-amber-200" :icon="['fas', 'trophy']" /> 已通关
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="mt-10">暂无数据</div>
      </div>
      <div v-else class="mt-10">Loading...</div>
    </TitleCard>
    <button
      :disabled="loading2"
      v-if="!loading"
      class="btn btn-circle btn-success text-white refresh shadow-lg fixed bottom-3 right-5"
      @click="refresh"
      :class="{rotate: loading2}"
    >
      <font-awesome-icon :icon="['fas', 'arrows-rotate']" />
    </button>
  </div>
</template>
  
<script setup>
import TitleCard from '@/components/TitleCard.vue';
import { ref, onUnmounted } from 'vue'
import { api } from '@/tools/api'
import { rankEventListener, user } from '@/tools/bus'
import { useRouter } from 'vue-router';
import notificationManager from '@/tools/notification.js'
const router = useRouter()
const rank = ref([]);
const loading = ref(true)
const loading2 = ref(false)
const currentUser = ref({
  rank: 0,
  username: user.username.value,
  passed: 0,
  points: 0,
  lastPassed: new Date(0),
  noPrize: false,
  gameover: false,
  hidden: true
})
function calculateRank(ranks) {
  if (ranks.length == 0) return []
  let rank = 1
  let last = ranks[0]
  last.rank = rank
  last.lastPassed = new Date(last.lastPassed)
  if (last.username == user.username.value) {
    currentUser.value = last
  }
  for (let i = 1; i < ranks.length; i++) {
    if (ranks[i].username == user.username.value) {
      currentUser.value = ranks[i]
    }
    ranks[i].lastPassed = new Date(ranks[i].lastPassed)
    if (ranks[i].passed == last.passed && ranks[i].points == last.points && ranks[i].lastPassed.getTime() == last.lastPassed.getTime()) {
      ranks[i].rank = rank
    } else {
      ranks[i].rank = ++rank
    }
    last = ranks[i]
  }
  return ranks
}
async function refresh(noNotification) {
  loading2.value = true
  try {
    const res = await api("/api/rank")
    rank.value = calculateRank(res.rank)
    if (!noNotification) {
      notificationManager.add({
        message: '刷新成功',
        type: 'success'
      })
    }
  } catch (err) {
    if (err.status == 401) {
      localStorage.setItem("afterLogin", "/rank")
      router.push("/login")
    }
    console.log(err)
  } finally {
    loading2.value = false
  }
}
function refreshWithNotification() {
  refresh(true)
} 
rankEventListener.addEventListener('update', refreshWithNotification)
onUnmounted(() => {
  rankEventListener.removeEventListener('update', refreshWithNotification)
})
; (async function () {
  try {
    const res = await api("/api/rank")
    rank.value = calculateRank(res.rank)
  } catch (err) {
    if (err.status == 401) {
      localStorage.setItem("afterLogin", "/rank")
      router.push("/login")
    }
    console.log(err)
  } finally {
    loading.value = false
  }
})();
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


</style>