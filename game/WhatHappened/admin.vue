<template>
    <div class="flex justify-center mt-4" style="flex-wrap: wrap;">
        <button class="btn btn-primary" @click="reset">{{  text }}</button>
    </div>
</template>

<script setup>
import { inject, ref } from 'vue'
const text = ref('重置回合')
const api = inject('admin_api')
async function reset() {
    text.value = await api('reset')
    setTimeout(() => {
        text.value = '重置回合'
    }, 1000)
}
function $x(xpath, context = document) {
    const iterator = document.evaluate(xpath, context, null, XPathResult.ANY_TYPE, null);
    const results = [];
    let item;
    while (item = iterator.iterateNext()) {
        results.push(item);
    }
    return results;
}
$x("//button[text()='跳过此题']").forEach(e => e.remove())
</script>