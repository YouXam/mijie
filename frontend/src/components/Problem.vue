<template>
    <template v-if="props.description">
        <template v-if="props.description.content">
            <Markdown :content="props.description.content" />
        </template>
        <Suspense v-else>
            <Mdv :description="props.description" />
            <template #fallback>
                <Loading />
            </template>
        </Suspense>
    </template>
    <Loading v-else />
</template>

<script setup>
// @ts-ignore
import Markdown from './Markdown.vue';
// @ts-ignore
import Loading from './Loading.vue';
import { defineAsyncComponent } from 'vue';
const props = defineProps(['description'])

const Mdv = defineAsyncComponent(() => import('./Mdv.vue'))
</script>