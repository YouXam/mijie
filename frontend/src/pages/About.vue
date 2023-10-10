<template>
    <TitleCard title="关于" class="mb-20" :minHeight="100">
        <template #subtitle><div class="mt-10"></div></template>
        <div class="px-5 pt-5">
            <Problem :content="about" v-if="about.length"></Problem>
            <div v-else>
                空
            </div>
        </div>
    </TitleCard>
</template>
  
<script>
import Problem from '@/components/Problem.vue'
import TitleCard from '@/components/TitleCard.vue';
import { api } from '@/tools/api'
export default {
    components: {
        TitleCard,
        Problem
    },
    data: () => ({
        about: ''
    }),
    created() {
        api('/api/game-config/about').then(res => {
            this.about = res.about
        })
    },
};
</script>
  
