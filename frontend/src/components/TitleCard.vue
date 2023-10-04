<template>
    <div class="mx-auto text-center flex flex-col items-center justify-center">
        <div class="mt-10 title">
            <h1 class="text-5xl font-extrabold tracking-tight mb-5">{{ title }}</h1>
            <div class="mb-10">
                <slot name="subtitle"></slot>
            </div>
        </div>
        <MainCard :minHeight="minHeight">
            <slot></slot>
        </MainCard>
    </div>
</template>

<script>
import MainCard from '@/components/MainCard.vue';
export default {
    name: "TitleCard",
    components: {
        MainCard
    },
    props: {
        title: {
            type: String,
            required: true
        },
        minHeight: {
            type: Number,
            default: 400
        }
    },
}
</script>

<style scoped>
.title {
    font-family: "Neutraface Text", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";;
}
</style>

  