<template>
    <div ref="card" class="card p-5 sm:min-w-[50%] min-w-full rounded-none sm:rounded-2xl" :style="{ minHeight: minHeight + 'px' }">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "MainCard",
    props: {
        minHeight: {
            type: Number,
            default: 400
        }
    },
    methods: {
        handleMouseMove(e) {
            const card = this.$refs.card;
            const rect = card.getBoundingClientRect();
            if (rect.left < 0 || rect.top < 0 || rect.right > window.innerWidth || rect.bottom > window.innerHeight) return;
            const cardX = rect.left + window.scrollX + rect.width / 2;
            const cardY = rect.top + window.scrollY + rect.height / 2;
            const xAxis = (cardX - e.pageX) / rect.width;
            const yAxis = -(cardY - e.pageY) / rect.height;
            card.style.transform = `perspective(700px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        },
        handleMouseOut(e) {
            this.$refs.card.style.transform = `perspective(700px) rotateY(0deg) rotateX(0deg)`;
        },
    },
    created() {
        if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) return;
        this.mouseMoveListener = document.addEventListener('mousemove', this.handleMouseMove);
        this.mouseOutListener = document.addEventListener('mouseout', this.handleMouseOut);
    },
    unmounted() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseout', this.handleMouseOut);
    },
}
</script>

<style scoped>
.card {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: 800px;
    max-width: 80%;
    box-shadow: 0 20px 50px rgba(255, 255, 255, 0.1);
    transition: all 0.1s;
    will-change: transform;
    color: #fff; 
}
</style>
  