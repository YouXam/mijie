<template>
  <TitleCard title="排行榜">
    <template #subtitle><div class="mt-10"></div></template>
    <div class="overflow-x-auto">
      <table class="table ">
        <!-- head -->
        <thead>
          <tr class="text-white">
            <th></th>
            <th>用户名</th>
            <th>通过题数</th>
            <th>分数</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, index) in rank" :key="user.username">
            <th>{{ index + 1 }}</th>
            <td>{{ user.username }}</td>
            <td>{{ user.passed }}</td>
            <td>{{ user.points }}</td>
            <td>{{ user.gameover ? "已通关": "" }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </TitleCard>
</template>
  
<script setup>
import TitleCard from '@/components/TitleCard.vue';
import { ref } from 'vue'
import { api } from '@/tools/api'
import { useRouter } from 'vue-router';
const router = useRouter()
const rank = ref([]);
; (async function () {
  try {
    const res = await api("/api/rank")
    rank.value = res.rank
  } catch (err) {
    if (err.status == 401) {
      localStorage.setItem("afterLogin", "/rank")
      router.push("/login")
    }
  }
})();
</script>