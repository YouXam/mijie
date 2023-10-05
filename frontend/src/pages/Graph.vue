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
            if (node == '__first__') return this.$router.push("/start")
            if (node == '__gameover__') return this.$router.push("/gameover")
            this.$router.push("/game/" + node)
        }
    },
    async created() {
        try {
            const res = await api("/api/problem")
            if (!res.problems) return
            const hashMap = {}
            let hasGameOver = false, firsts = []
            res.problems.forEach(x => {
                hashMap[x.pid] = x
                if (x.gameover) hasGameOver = true
                if (x.first) firsts.push(x.pid)
            })
            this.data = res.problems.map(x => ({
                id: x.pid,
                text: x.name,
                style:"fill:lime,stroke:lime,stroke-width:0px;",
                next: (x.next?.map(x => x.pid) || []).concat(x.gameover ? ["__gameover__"] : [])
            })).concat(res.problems.reduce((a, b) => a.concat(b?.next?.filter(x => !hashMap[x.pid]) || []), []).map(x => ({
                id: x.pid,
                text: x.name
            }))).concat(hasGameOver ? [{id: "__gameover__", text: "游戏结束", style:"fill:#1e2329,stroke:#a7adb9,color:#a7adb9;"}] : [])
            .concat(firsts.length ? [{id: "__first__", text: "游戏开始", next: firsts, style:"fill:#1e2329,stroke:#a7adb9,color:#a7adb9;"}] : [])
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

