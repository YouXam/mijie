<template>
    <TitleCard title="关于" class="mb-20" :minHeight="100">
        <template #subtitle><div class="mt-10"></div></template>
        <Markdown :content="about" v-if="about.length"></Markdown>
        <div class="px-5 pt-5" v-else>
            空
        </div>
    </TitleCard>
    <footer class="text-center text-gray-400 text-xs absolute -bottom-8 w-full font-mono">
        &copy; {{ new Date().getFullYear() }} Website developed by <a href="https://github.com/YouXam" target="_blank" class="link">YouXam</a>
    </footer>
</template>
  
<script>
import Markdown from '@/components/Markdown.vue'
import TitleCard from '@/components/TitleCard.vue';
import { api } from '@/tools/api'
export default {
    components: {
        TitleCard,
        Markdown
    },
    data: () => ({
        about: ''
    }),
    created() {
        api('/api/game-config/about').then(res => {
            this.about = res.about || ''
        })
    },
};
</script>
  
