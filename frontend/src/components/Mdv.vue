<template>
    <div class="text-left w-full" :class="{'markdown-body': markdown}">
        <Content/>
    </div>
</template>

<script setup>
import mdvc from 'mdvc'
import { defineAsyncComponent, ref } from 'vue';
import * as vue from 'vue'

import hljs from 'markdown-it-highlightjs'
import latex from 'markdown-it-katex'
import '@/assets/css/hljs-github-dark.min.css'
import 'github-markdown-css/github-markdown-dark.css'
const markdown = ref(false)

function join(...paths) {
    let parts = [];
    for (let i = 0, l = paths.length; i < l; i++) {
        parts = parts.concat(paths[i].split("/"));
    }
    let newParts = [];
    for (let i = 0, l = parts.length; i < l; i++) {
        let part = parts[i];
        if (!part || part === ".") continue;
        if (part === "..") newParts.pop();
        else newParts.push(part);
    }
    if (parts[0] === "") newParts.unshift("");
    return newParts.join("/") || (newParts.length ? "/" : ".");
}

const props = defineProps(['description'])
if (!props?.description?.mdv?.main) throw new Error("No main mdv provided")
if (props.description.mdv.main.endsWith(".md")) markdown.value = true
const Content = defineAsyncComponent(() => mdvc(props.description.mdv.main, {
    async getFile(path) {
        const headers = {
            'Content-Type': 'application/json',
        }
        if (localStorage.getItem('token')) headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        let target = join("/api/file/", props.description.pid, path)
        if (path.endsWith(".vue") || path.endsWith(".ts") || path.endsWith(".js")) {
            const res = await fetch(target, { headers })
            return await res.text()
        }
        return fetch(target, { headers })
    },
    extend: (md) => {
        md.use(hljs).use(latex)
    },
    imports: {
        vue
    }
}))
</script>