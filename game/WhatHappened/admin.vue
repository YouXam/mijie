<template>
    <div class="flex justify-center" style="flex-wrap: wrap;">
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
</script>