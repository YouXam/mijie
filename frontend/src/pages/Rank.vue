<template>
  <div>
    <TitleCard title="排行榜">
      <template #subtitle><div class="mt-10"></div></template>
      <div class="overflow-x-auto" v-if="!loading">
        <table class="table ">
          <!-- head -->
          <thead>
            <tr class="text-white">
              <th>排名</th>
              <th>用户名</th>
              <th>题数</th>
              <th>分数</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in rank" :key="user.username">
              <th>{{ user.rank }}</th>
              <td>{{ user.username }}</td>
              <td>{{ user.passed }}</td>
              <td>{{ user.points }}</td>
              <td>{{ user.gameover ? "已通关": "" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="mt-10">Loading...</div>
    </TitleCard>
    <button
      :disabled="loading2"
      v-if="!loading"
      class="btn btn-circle btn-success refresh shadow-lg fixed bottom-3 right-5"
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
import { rankEventListener } from '@/tools/bus'
import { useRouter } from 'vue-router';
import notificationManager from '@/tools/notification.js'
const router = useRouter()
const rank = ref([]);
const loading = ref(true)
const loading2 = ref(false)
function calculateRank(ranks) {
  let rank = 1
  let last = ranks[0]
  last.rank = rank
  for (let i = 1; i < ranks.length; i++) {
    if (ranks[i].passed == last.passed && ranks[i].points == last.points) {
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