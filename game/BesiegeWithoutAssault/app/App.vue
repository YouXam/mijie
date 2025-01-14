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
        <input class="input" type="number" v-model="speedRate" />
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
        intention: [],
        you: null,
        enemy: new Coordinate(0, 0),
        length: 0,
        speedRate: 0.5,
    }),
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
            this.intention = [x, y]
            this.$refs.canvasComponent.intention(1, x, y);
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
            if (this.intention.length === 0) {
                return;
            }
            const data = await move(this.you, this.enemy, this.intention[0], this.intention[1] , async (you, enemy, delta) => {
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