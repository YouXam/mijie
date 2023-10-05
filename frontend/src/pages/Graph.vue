<template>
    <div class="container mx-auto text-center flex flex-col items-center justify-center">
        <div class="mt-10">
            <h1 class="text-5xl font-extrabold tracking-tight">流程图</h1>
        </div>
        <div ref="card" class="card p-10">
            <vue-mermaid v-show="loaded && data.length" class="w-full" :nodes="data" @nodeClick="clickNode"></vue-mermaid>
            <span v-show="loaded && !data.length">还没有通过的题目，<router-link class="link" to="/start">点我</router-link>开始吧</span>
            <span v-show="!loaded">Loading...</span>
        </div>
    </div>
</template>

<script>
import { api } from '@/tools/api'
export default {
    data() {
        return {
            loaded: false,
            data: []
        }
    },
    methods: {
        clickNode(node) {
            this.$router.push("/game/" + node)
        }
    },
    async created() {
        try {
            const res = await api("/api/problem")
            if (!res.problems) return
            const hashMap = {}
            res.problems.forEach(x => hashMap[x.pid] = x)
            this.data = res.problems.map(x => ({
                id: x.pid,
                text: x.name + " ✔️",
                next: x.next?.map(x => x.pid)
            })).concat(res.problems.reduce((a, b) => a.concat(b?.next?.filter(x => !hashMap[x.pid]) || []), []).map(x => ({
                id: x.pid,
                text: x.name
            })))
            this.loaded = true
        } catch (err) {
            if (err.status == 401) {
                localStorage.setItem("afterLogin", "/graph")
                this.$router.replace("/login")
            }
            console.log(err)
        }
        
    }
}
</script>

