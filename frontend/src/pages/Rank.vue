<template>
  <TitleCard title="排行榜">
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Job</th>
            <th>Favorite Color</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr>
            <th>1</th>
            <td>Cy Ganderton</td>
            <td>Quality Control Specialist</td>
            <td>Blue</td>
          </tr>
          <!-- row 2 -->
          <tr>
            <th>2</th>
            <td>Hart Hagerty</td>
            <td>Desktop Support Technician</td>
            <td>Purple</td>
          </tr>
          <!-- row 3 -->
          <tr>
            <th>3</th>
            <td>Brice Swyre</td>
            <td>Tax Accountant</td>
            <td>Red</td>
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
    console.log(res)
  } catch (err) {
    if (err.status == 401) {
      localStorage.setItem("afterLogin", "/rank")
      router.push("/login")
    }
  }
})();
</script>