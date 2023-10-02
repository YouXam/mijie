<template>
    <div class="container mx-auto text-center flex flex-col items-center justify-center">
        <div class="mt-10">
            <h1 class="text-5xl font-extrabold tracking-tight mb-20">关于</h1>
        </div>
        <div ref="card" class="card p-10">
            <div class="p-8">
                <p>欢迎来到解谜游戏！</p>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    methods: {
        handleMouseMove(e) {
            const card = this.$refs.card;
            const rect = card.getBoundingClientRect(); // 获取卡片的位置和尺寸
            const cardX = rect.left + window.scrollX + rect.width / 2; // 计算卡片 X 坐标的中心
            const cardY = rect.top + window.scrollY + rect.height / 2; // 计算卡片 Y 坐标的中心
            const xAxis = (cardX - e.pageX) / 150; // 计算鼠标相对于卡片 X 中心的位置
            const yAxis = -(cardY - e.pageY) / 150; // 计算鼠标相对于卡片 Y 中心的位置
            card.style.transform = `perspective(700px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        },
        handleMouseOut(e) {
            this.$refs.card.style.transform = `perspective(700px) rotateY(0deg) rotateX(0deg)`;
        }
    },
    created() {
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
  