<template>
    <div class="mx-auto text-center flex flex-col items-center justify-center pb-10">
        <div class="max-w-[80%] w-[800px]">
            <h1 class="sm:text-5xl text-4xl mt-7 mb-5 font-extrabold tracking-tight">公告</h1>
            <template v-if="user.admin.value > 0">
                <div class="flex flex-col w-full">
                    <textarea class="mt-5 textarea" style="border-color: hsl(var(--bc) / 0.2)" placeholder="公告内容(Markdown格式)"
                        v-model="content"
                        v-auto-expand
                        @keydown.ctrl.enter="submit"
                    ></textarea>
                    <button :disabled="content.length == 0 || loading" class="submit btn btn-outline mt-5 mb-5" @click="submit">
                        <span class="loading loading-dots loading-xs" v-if="loading"></span>
                        提交
                    </button>
                </div>
            </template>
        </div>
        <template v-if="notices?.length">
            <div v-for="(notice, index) in notices" :key="notice._id" class="card p-5 pt-2 sm:max-w-[80%] sm:w-[800px] mb-5 sm:min-w-0 min-w-full rounded-none sm:rounded-lg min-h-[50px]">
                <div class="min-h-[50px]">
                    <div >
                        <button
                            class="fixed right-2 top-2 drawer-button btn btn-circle btn-sm btn-ghost hover:text-red-600"
                            v-if="user.admin.value > 0"
                            @click="toRemove = index; modal.showModal()"
                        >
                            <font-awesome-icon :icon="['fas', 'trash']" />
                        </button>
                        <h1 class="text-gray-400 font-extralight">{{ new Date(notice.time).toLocaleString() }} by {{ notice.author }}</h1>
                        <Markdown :content="notice.content"></Markdown>
                    </div>
                </div>
            </div>
        </template>
        <div class="min-h-[100px] flex flex-col items-center justify-center" v-else>暂无</div>
        <dialog ref="modal" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box">
                <h3 class="font-bold text-lg my-5">确认删除这条公告？</h3>
                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn mt-5 mr-5">取消</button>
                        <button class="btn btn-error text-white mt-5" @click="remove()">确认</button>
                    </form>
                </div>
            </div>
        </dialog>
    </div>
</template>

<script setup> 
import Markdown from '@/components/Markdown.vue';
import { ref, onUnmounted } from 'vue'
import { user, noticeEventListener } from '@/tools/bus'
import { api, apiDelete } from '@/tools/api'
import { useRouter } from 'vue-router';
const loading = ref(true);
const notices = ref([]);
const router = useRouter();
const content = ref("");
const modal = ref(null);
const toRemove = ref(null);
async function remove() {
    try {
        await apiDelete(`/api/notice/${notices.value[toRemove.value]._id}`);
        notices.value.splice(toRemove.value, 1);
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem("afterLogin", "/rank")
            router.push("/login")
        }
        console.error(err);
    }
}
async function refresh() {
    loading.value = true
    try {
        const res = await api('/api/notice');
        notices.value = res.notices;
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem("afterLogin", "/rank")
            router.push("/login")
        }
        console.error(err);
    } finally {
        loading.value = false;
    } 
}
refresh();
noticeEventListener.addEventListener('update', refresh);
onUnmounted(() => {
    noticeEventListener.removeEventListener('update', refresh);
});
async function submit() {
    loading.value = true
    try {
        const res = await api('/api/notice', {
            content: content.value
        });
        refresh();
        content.value = ''
    } catch (err) {
        if (err.status == 401) {
            localStorage.setItem("afterLogin", "/rank")
            router.push("/login")
        }
        console.error(err);
    } finally {
        loading.value = false;
    }
}

</script>

<style scoped>
.card {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    width: 800px;
    max-width: 80%;
    box-shadow: 0 20px 50px rgba(255, 255, 255, 0.1);
    transition: all 0.1s;
    will-change: transform;
    color: #fff; 
}

.textarea {
    animation: button-pop var(--animation-btn, 0.25s) ease-out;
}
</style>