<template>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px">
        <CanvasComponent ref="canvasComponent" @move="handleClick" style="margin: 0 auto" />
        <p v-if="you">
            You: ({{ you.x.toFixed(6) }}, {{ you.y.toFixed(6) }})
        </p>
        <p v-else>
            点击坐标系上的任意位置作为起点
        </p>
        <p>
            Enemy: ({{ enemy.x.toFixed(6) }}, {{ enemy.y.toFixed(6) }})
        </p>
        <p>
            Length: {{ length }}
        </p>
        <div style="display: flex; flex-direction: row; gap: 10px">
            <span style="align-items: center; margin: auto 0;">SpeedRate: </span>
            <input class="input" type="number" v-model="speedRate" step="0.000000001" />
        </div>
        <div v-if="you" style="display: flex; flex-direction: row; gap: 10px">
            <span style="align-items: center; margin: auto 0;">Next: </span>
            <input class="input" type="number" v-model="next_x" step="0.000000001" />
            <input class="input" type="number" v-model="next_y" step="0.000000001" />
        </div>
        <div style="display: flex; flex-direction: row; gap: 10px">
            <button class="btn" @click="resetPoints">Reset</button>
            <button v-if="you" class="btn" @click="movePoint">Move</button>
        </div>
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
        next_x: 0,
        next_y: 0,
        you: null,
        enemy: new Coordinate(0, 0),
        length: 0,
        speedRate: 0.5,
    }),
    watch: {
        next_x() { this.$refs.canvasComponent.intention(1, this.next_x, this.next_y); },
        next_y() { this.$refs.canvasComponent.intention(1, this.next_x, this.next_y); }
    },
    methods: {
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
            this.enemy.x = this.enemy.y = 0;
            this.you = null;
            this.length = 0;
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
        },
    },
    mounted() {
        this.resetPoints()
    },
};
</script>