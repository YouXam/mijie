<template>
    <TitleCard title="游戏规则" class="mb-20" :minHeight="100">
        <template #subtitle><div class="mt-10"></div></template>
        <div class="px-5 pt-5">
            <Problem :content="gamerule" v-if="gamerule.length"></Problem>
            <div class="mb-5" v-else>
                空
            </div>
        </div>
        <div class="w-full" v-if="$route.query.hasOwnProperty('start')">
            <button class="btn btn-outline w-1/2 text-xl" @click="confirm">确认</button>
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
        gamerule: ''
    }),
    methods: {
        start() {
            if (localStorage.getItem('hasReadRule') !== null) this.$router.push('/start');
        },
        confirm() {
            if (localStorage.getItem('hasReadRule') === null) {
                localStorage.setItem('hasReadRule', true);
            }
            this.start()
        }
    },
    created() {
        if (this.$route.query.hasOwnProperty('start')) this.start()
        api('/api/game-config/gamerule').then(res => {
            this.gamerule = res.gamerule || ''
        })
    },
};
</script>
  
