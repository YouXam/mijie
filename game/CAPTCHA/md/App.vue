<template>
    <p>请选出以下包含 <strong v-html="ele"></strong> 的所有图片：</p>
    <div class="grid">
        <Image v-for="(url, i) in urls" :key="i" :src="url" @change="toggle(i)" :selected="selected[i]" />
    </div>
    <button class="btn" :disabled="disabled" style="margin-top: 20px;" @click="update">换一个</button>
    <button class="btn" :disabled="disabled" @click="submit">提交</button>
</template>

<style scoped>
p {
    margin: 0;
    margin-bottom: 1em;
    font-size: 1.5em;
}
button {
    display: block;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    margin-top: 10px;
}
.grid {
    max-width: 400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    background-color: #ccc;
}
</style>

<script setup>
import { ref, inject } from 'vue';
import Image from './Image.vue';
const api = inject('api')
const disabled = ref(true)
let name = ''
const ele = ref('')
const pos = Array.from({ length: 16 }, (_, i) => `${(Math.floor(i / 4) + 1)}_${(i % 4) + 1}`)
const selected = ref(Array(16).fill(false))
const urls = ref(Array(16).fill(''))
function toggle(i) {
    selected.value[i] = !selected.value[i]
}
async function update() {
    disabled.value = true
    selected.value.fill(false)
    const { name: n, ele: e } = await api("update", { name })
    name = n
    ele.value = e
    urls.value = await Promise.all(pos.map(async (v) => (await import(`./${name}/part_${v}.png`)).default))
    disabled.value = false
}
async function submit() {
    const result = [...selected.value].reduce((acc, cur) => (acc << 1) + cur, 0)
    const res = await api("submit", { name, result })
    if (res === false) update()
}
update()
</script>