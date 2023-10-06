<!-- src/components/DownloadList.vue -->
<template>
    <ul class="menu bg-base-200 w-full rounded-box">
        <li v-for="file in files" :key="file.id" @click="downloadFile(file)">
            <a>
                <font-awesome-icon :icon="['fas', 'file-arrow-down']" />
                {{ file }}
            </a>
        </li>
    </ul>
</template>
  
<script>
export default {
    props: {
        files: {
            type: Array,
            required: true
        }
    },
    methods: {
        downloadFile(file) {
            this.$emit('download', file);
        }
    }
}
</script>
  
<style scoped></style>
  