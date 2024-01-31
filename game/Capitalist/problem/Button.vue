<template>
    <button class="btn"  @click="reverse">{{ msg }}</button>
</template>


<script setup>
import { ref } from 'vue'
const msg = ref('Hello World!')
const reverse = () => {
    msg.value = msg.value.split('').reverse().join('')
}
</script>