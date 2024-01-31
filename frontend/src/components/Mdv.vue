<template>
    <div  class="markdown-body text-left w-full">
        <Content/>
    </div>
</template>

<script setup>
import mdvc from 'mdvc'
import { defineAsyncComponent } from 'vue';
import * as vue from 'vue'

import hljs from 'markdown-it-highlightjs'
import latex from 'markdown-it-katex'
import '@/assets/css/hljs-github-dark.min.css'
import 'github-markdown-css/github-markdown-dark.css'

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

const Content = defineAsyncComponent(() => mdvc(props.description.mdv.main, {
    getFile: async (path) => {
        const headers = {
            'Content-Type': 'application/json',
        }
        if (localStorage.getItem('token')) headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        let target = join("/api/file/", props.description.pid, join(props.description.mdv.main, ".."), path)
        if (path === props.description.mdv.main) 
            target = join("/api/file/", props.description.pid, path)
        const res = await fetch(target, { headers })
        const data = await res.text()
        return data
    },
    extend: (md) => {
        console.log(123)
        md.use(hljs).use(latex)
    },
    imports: {
        vue
    }
}))
</script>