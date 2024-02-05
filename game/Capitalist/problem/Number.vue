<template>
    <span style="font-size: 1rem">
        <span style="font-family: monospace">{{ animatedNumber }}</span>
        <span v-if="currentDifference" :style="{ fontSize: '0.8rem', color }" style="font-family: monospace">
            ({{ sign }}{{ animatedDifference }})
        </span>
    </span>
</template>
  
<script lang="ts">
export default {
    props: {
        number: {
            type: Number,
            required: true,
        },
        tofixed: {
            type: Number,
            required: false,
            default: 0
        },
        duration: {
            type: Number,
            required: false,
            default: 1000
        },
        close_diff: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data() {
        return {
            currentNumber: 0,
            currentDifference: 0,
            animationFrameId: null,
            color: 'red',
            sign: ''
        };
    },
    watch: {
        close_diff() {
            this.currentDifference = 0;
        },
        number(newValue, oldValue) {
            this.color = newValue > oldValue ? 'red' : 'green'
            this.sign = newValue > oldValue ? '+' : ''
            this.animateNumber(this.currentNumber, newValue, 0, newValue - oldValue);
        },
    },
    computed: {
        animatedNumber() {
            return this.currentNumber && !isNaN(this.currentNumber) ? this.currentNumber.toFixed(this.tofixed) : 0;
        },
        animatedDifference() {
            return this.currentDifference && !isNaN(this.currentDifference) ? this.currentDifference.toFixed(this.tofixed) : 0;
        },
    },
    methods: {
        animateNumber(start: number, end: number, startd: number, endd: number) {
            let startTime = 0
            const duration = this.duration;
            const step = (currentTime: number) => {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                this.currentNumber = start + (end - start) * progress;
                this.currentDifference = startd + (endd - startd) * progress;
                if (progress < 1) this.animationFrameId = requestAnimationFrame(step) as any
                else {
                    cancelAnimationFrame(this.animationFrameId as any);
                }
            };
            cancelAnimationFrame(this.animationFrameId as any);
            this.animationFrameId = requestAnimationFrame(step)  as any;
        },
    },
    beforeDestroy() {
        cancelAnimationFrame(this.animationFrameId as any);
    },
    created() {
        this.currentNumber = this.number;
    },
};
</script>
  