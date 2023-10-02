<template>
    <div class="container mx-auto text-center flex flex-col items-center justify-center">
        <div class="mt-10">
            <h1 class="text-5xl font-extrabold tracking-tight">流程图</h1>
        </div>
        <div ref="card" class="card p-10">
            <vue-mermaid class="w-full" :nodes="data" @nodeClick="clickNode"></vue-mermaid>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            data: [
                { id: "1", text: "Anime", next: ["2", "3"]},
                { id: "2", text: "B" },
                { id: "3", text: "C" },
            ]
        }
    },
    methods: {
        clickNode(node) {
            console.log(node)
        }
    }
}
</script>

