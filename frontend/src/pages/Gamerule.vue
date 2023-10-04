<template>
    <TitleCard title="游戏规则">
        <div class="p-8 min-h-[300px]">
            <p>游戏规则...</p>
        </div>
        <div class="w-full" v-if="$route.query.hasOwnProperty('start')">
            <button class="btn btn-outline w-1/2 text-xl" @click="confirm">确认</button>
        </div>
    </TitleCard>
</template>
  
<script>
import TitleCard from '@/components/TitleCard.vue';
export default {
    components: {
        TitleCard
    },
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
    },
};
</script>
  
