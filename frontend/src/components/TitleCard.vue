<template>
    <div class="mx-auto text-center flex flex-col items-center justify-center">
        <div class="mt-10 max-w-[80%] w-[800px]">
            <h1 class="text-5xl font-extrabold tracking-tight mb-5 leading-tight">{{ title }}</h1>
            <div class="mb-5">
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


  