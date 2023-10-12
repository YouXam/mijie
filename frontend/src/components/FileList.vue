<!-- src/components/DownloadList.vue -->
<template>
    <ul class="menu bg-base-200 w-full rounded-box">
        <li v-for="file in files" :key="file.id" @click="downloadFile(file)">
            <a>
                <font-awesome-icon :icon="['fas', 'file-arrow-down']" />
                <template v-if="typeof file === 'string'">
                    {{ file }}
                </template>
                <template v-else>
                    <div class="tooltip tooltip-top" :data-tip="file.info">
                        {{ file.filename }}
                    </div>
                </template>
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
            this.$emit('download', typeof file === 'string' ? file : file.filename);
        }
    }
}
</script>
  
<style scoped></style>
  