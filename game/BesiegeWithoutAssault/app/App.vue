<template>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px">
        <CanvasComponent ref="canvasComponent" @move="handleClick" style="margin: 0 auto" />
        
        <div class="row">
            <code v-if="you">You: ({{ you.x.toFixed(6) }}, {{ you.y.toFixed(6) }})</code>        
            <code>Enemy: ({{ enemy.x.toFixed(6) }}, {{ enemy.y.toFixed(6) }})</code>
            <code>Length: {{ length.toFixed(6) }}</code>
        </div>
    
        <div class="row">
            <span style="align-items: center; margin: auto 0;">SpeedRate: </span>
            <input class="input" type="number" v-model="speedRate" step="0.001" />
        </div>
        <div v-if="!you" class="row">
            <span style="align-items: center; margin: auto 0;">Start: </span>
            <input class="input" type="number" v-model="start_x" step="0.001" />
            <input class="input" type="number" v-model="start_y" step="0.001" />
            <button class="btn" @click="start">Set</button>
        </div>
        <div v-if="you" class="row">
            <span style="align-items: center; margin: auto 0;">Next: </span>
            <input class="input" type="number" v-model="next_x" step="0.001" />
            <input class="input" type="number" v-model="next_y" step="0.001" />
            <button v-if="you" class="btn" @click="movePoint">Move</button>
        </div>
        <div class="row">
            <button class="btn" @click="resetPoints">Reset</button>
        </div>
        <p v-if="!you">点击坐标系上的任意位置或输入坐标作为起点</p>
        <p v-else-if="!intention">点击坐标系上的任意位置或输入坐标作为下一点</p>
    </div>
</template>

<script>
import CanvasComponent from './Canvas.vue';
import { move, Coordinate } from './lib.ts'

export default {
    components: {
        CanvasComponent,
    },
    data: () => ({
        start_x: 0,
        start_y: 0,
        next_x: 0,
        next_y: 0,
        intention: false,
        you: null,
        enemy: new Coordinate(0, 0),
        length: 0,
        speedRate: 0.5,
    }),
    watch: {
        next_x() { this.updateIntention(); },
        next_y() { this.updateIntention(); }
    },
    methods: {
        start() {
            this.handleClick({ x: this.start_x, y: this.start_y });
        },
        updateIntention() {
            this.intention = true;
            this.$refs.canvasComponent.intention(1, this.next_x, this.next_y);
        },
        handleClick({ x, y }) {
            if (this.you === null) {
                this.you = new Coordinate(x, y);
                this.$refs.canvasComponent.reset([
                    [this.enemy.x, this.enemy.y],
                    [this.you.x, this.you.y],
                ]);
                return;
            }
            this.next_x = x;
            this.next_y = y;
        },
        resetPoints() {
            this.enemy.x = this.enemy.y = this.start_x = this.start_y = this.next_x = this.next_y = 0;
            this.you = null;
            this.length = 0;
            this.intention = false;
            this.$refs.canvasComponent.reset([
                [this.enemy.x, this.enemy.y]
            ]);
        },
        async movePoint() {
            const data = await move(this.you, this.enemy, this.next_x, this.next_y, async (you, enemy, delta) => {
                this.you = you;
                this.enemy = enemy;
                this.$refs.canvasComponent.move(0, enemy.x, enemy.y);
                this.$refs.canvasComponent.move(1, you.x, you.y);
                this.length += delta
                await new Promise((resolve) => setTimeout(resolve, delta));
            }, this.speedRate);
            this.intention = false;
        },
    },
    mounted() {
        this.resetPoints()
    },
};
</script>

<style scoped>
.row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}
</style>