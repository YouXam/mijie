<template>
    <div class="container mx-auto text-center flex flex-col items-center justify-center">
        <div class="mt-10">
            <h1 class="text-5xl font-extrabold tracking-tight mb-20">游戏规则</h1>
        </div>
        <div ref="card" class="card p-10">
            <div class="p-8 min-h-[300px]">
                <p>游戏规则...</p>
            </div>
            <div class="w-full" v-if="$route.query.hasOwnProperty('start')">
                <button class="btn btn-outline w-1/2 text-xl" @click="confirm">确认</button>
            </div>
        </div>
    </div>
</template>
  
<script>


export default {
    methods: {
        handleMouseMove(e) {
            const card = this.$refs.card;
            const rect = card.getBoundingClientRect();
            const cardX = rect.left + window.scrollX + rect.width / 2;
            const cardY = rect.top + window.scrollY + rect.height / 2;
            const xAxis = (cardX - e.pageX) / 150;
            const yAxis = -(cardY - e.pageY) / 150;
            card.style.transform = `perspective(700px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        },
        handleMouseOut(e) {
            this.$refs.card.style.transform = `perspective(700px) rotateY(0deg) rotateX(0deg)`;
        },
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
        this.mouseMoveListener = document.addEventListener('mousemove', this.handleMouseMove);
        this.mouseOutListener = document.addEventListener('mouseout', this.handleMouseOut);
    },
    unmounted() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseout', this.handleMouseOut);
    },
};
</script>
  
<style scoped>

.card {
    background-color: rgba(255, 255, 255, 0.1); 
    backdrop-filter: blur(10px);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: 800px;
    max-width: 80%;
    min-height: 400px;
    box-shadow: 0 20px 50px rgba(255, 255, 255, 0.1);
    transition: all 0.1s;
    will-change: transform;
    color: #fff; 
}


.content {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
  