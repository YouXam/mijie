<template>
    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px">
        <CanvasComponent ref="canvasComponent" @move="handleClick" style="margin: 0 auto" />
        <div class="status" :style="{ gridTemplateColumns: '1fr' }">
            <code v-if="you">你的位置: ({{ you.x.toFixed(6) }}, {{ you.y.toFixed(6) }})</code>
            <code>敌军位置: ({{ enemy.x.toFixed(6) }}, {{ enemy.y.toFixed(6) }})</code>
            <code>敌军累计路程: {{ length.toFixed(6) }}</code>
        </div>
        <p v-if="result">
            <span v-if="result === 'success'">你赢了！</span>
            <span v-else-if="result === 'out-of-range'">你输了：敌军逃出了包围圈</span>
            <span v-else>你输了：距离敌军太近了</span>
        </p>
        <p v-else-if="!you">点击坐标系上的任意位置 或 输入坐标并点击“确定”按钮 以确定你的起点</p>
        <p v-else-if="!intention">点击坐标系上的任意位置 或 输入坐标作为下一点</p>
        <p v-else-if="moving">正在移动... ({{ (progress * 100).toFixed(2) }}%)</p>
        <p v-else>点击“移动”按钮以移动到下一点</p>
        <div v-if="!you && !result" class="row">
            <span>起点: </span>
            <input class="input" style="width: 30%" type="number" v-model="start_x" step="0.001" />
            <input class="input" style="width: 30%" type="number" v-model="start_y" step="0.001" />
            <button class="btn" @click="start">确定</button>
        </div>
        <div v-if="you && !result" class="row">
            <span>下一点: </span>
            <input class="input" style="width: 30%" type="number" v-model="next_x" step="0.001" />
            <input class="input" style="width: 30%" type="number" v-model="next_y" step="0.001" />
            <button v-if="you" class="btn" @click="movePoint" :disabled="moving || !intention">移动</button>
        </div>
        <div class="row">
            <button class="btn" :class="{ 'btn-ghost': !result }" @click="resetPoints"
                style="min-width: 250px;">重置游戏</button>
        </div>
    </div>
</template>

<script>
import CanvasComponent from './Canvas.vue';
import { move, Coordinate } from './lib.ts'
import { inject } from 'vue';

export default {
    components: {
        CanvasComponent,
    },
    setup() {
        return { api: inject('api'), reset_problem: inject('reset') };
    },
    data: () => ({
        start_x: 0,
        start_y: 0,
        next_x: 0,
        next_y: 0,
        intention: false,
        progress: 0,
        moving: false,
        you: null,
        enemy: new Coordinate(0, 0),
        length: 0,
        result: null
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
            if (this.result) return;
            if (this.you === null) {
                this.you = new Coordinate(x, y);
                this.$refs.canvasComponent.reset([
                    [this.enemy.x, this.enemy.y],
                    [this.you.x, this.you.y],
                ]);
                this.api('start', { x, y });
                return;
            }
            this.next_x = x;
            this.next_y = y;
        },
        resetPoints() {
            this.enemy.x = this.enemy.y = this.start_x = this.start_y = this.next_x = this.next_y = 0;
            this.you = null;
            this.result = null;
            this.length = 0;
            this.progress = 0;
            this.$refs.canvasComponent.reset([
                [this.enemy.x, this.enemy.y]
            ]);
            this.$nextTick(() => {
                this.intention = false;
            });
            this.reset_problem();
        },
        async movePoint() {
            if (this.moving || !this.intention) return;
            this.moving = true;
            const nx = this.next_x, ny = this.next_y;
            const report = { 
                next: { x: nx, y: ny },
                player: { x: this.you.x, y: this.you.y },
                enemy: { x: this.enemy.x, y: this.enemy.y }
            }
            const data = await move(
                this.you,
                this.enemy,
                nx,
                ny,
                this.length,
                async (you, enemy, delta, progress) => {
                    this.you = you;
                    this.enemy = enemy;
                    this.$refs.canvasComponent.move(0, enemy.x, enemy.y);
                    this.$refs.canvasComponent.move(1, you.x, you.y);
                    this.length += delta
                    this.progress = progress;
                    await new Promise((resolve) => setTimeout(resolve, 1));
                }
            );
            this.api("move", report).then(err => {
                if (err && err.length > 0) {
                    alert(err + '\n请尝试重置游戏');
                }
            })
            if (data.result !== 'continue') {
                this.result = data.result;
            }
            this.progress = 0;
            this.moving = false;
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
    justify-content: center;
    gap: 10px;
}

p {
    margin: 0;
}

div.status {
    display: grid;
    gap: 10px 50px;
}

.desktop {
    display: none;
}

.mobile {
    display: initial;
}

@media (min-width: 768px) {
    .desktop {
        display: initial;
    }

    .mobile {
        display: none !important;
    }
}
</style>