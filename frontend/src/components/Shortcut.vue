<template>
    <div class="group-hover:text-primary-content" v-if="!isMac">
        <kbd class="kbd kbd-xs text-base-content" :class="{ 'disabled': props.disabled }">Ctrl</kbd>+<kbd class="kbd kbd-xs text-base-content" :class="{ 'disabled': props.disabled }">Enter</kbd>
    </div>
    <div class="group-hover:text-primary-content" v-if="isMac">
        <kbd class="kbd kbd-xs text-base-content" :class="{ 'disabled': props.disabled }">⌘ Enter</kbd>
    </div>
    
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps({
    disabled: Boolean
})
const isMac = ref(/macintosh|mac os x/i.test(navigator.userAgent));
</script>

<style>
kbd.disabled {
    background-color: #f3f4f6;
    color: #6b7280;
    border-color: #d1d5db;
    cursor: not-allowed;
}
</style>