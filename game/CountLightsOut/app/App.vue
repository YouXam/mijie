<template>
    <hr />
    <p style="text-align: center;">点击以下按钮切换灯的状态</p>
    <p style="text-align: center;" v-if="inited">当前有 {{ num }} 盏灯亮着</p>
    <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="display: grid; grid-template-columns: repeat(6, 1fr); max-width: 500px; min-width: 300px;">
            <button v-for="i in 36" :key="i" class="cell" ref="cells" @click="handleClick(i - 1)">
            </button>
        </div>
    </div>
</template>

<script setup>
import { inject, ref, } from 'vue';
const api = inject("api");
const num = ref(0);
const inited = ref(false);
const cells = ref([]);
api("init").then(data => {
    num.value = data
    inited.value = true
})
function handleClick(index) {
    const result = api("toggle", index)
    cells.value[index].classList.toggle('active');
    setTimeout(() => {
        cells.value[index].classList.toggle('active');
    }, 600);
    const row = Math.floor(index / 6), col = index % 6;
    const next = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
    ];
    setTimeout(() => {
        next.forEach(([r, c]) => {
            if (r >= 0 && r < 6 && c >= 0 && c < 6) {
                cells.value[r * 6 + c].classList.toggle('active');
                setTimeout(() => {
                    cells.value[r * 6 + c].classList.toggle('active');
                }, 300);
            }
        });
        setTimeout(async () => {
            num.value = await result
        }, 300);
    }, 300);
}
</script>

<style scoped>
.cell {
    border: 1px solid black;
    background-color: #888;
    padding: 10px;
    color: black;
    aspect-ratio: 1 / 1;
    transition: background-color 0.2s ease;
}
.cell:hover {
    background-color: #aaa;
}
.cell.active {
    background-color: #eee;
}
</style>