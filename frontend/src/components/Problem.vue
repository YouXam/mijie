<template>
    <div v-html="html" class="markdown-body text-left"></div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import hljs from 'markdown-it-highlightjs'
import latex from 'markdown-it-katex'
import '@/assets/css/hljs-github-dark.min.css'
import 'github-markdown-css/github-markdown-dark.css'

export default {
    props: {
        content: String
    },
    data: () => ({
        md: new MarkdownIt({
            html: true
        })
    }),
    computed: {
        html: function () {
            let res = this.md.render(this.content)
            return '<div>' + res + '</div>'
        }
    },
    created() {
        this.md.use(hljs).use(latex)
    }
}
</script>

<style>
.markdown-body {
    background-color: transparent;
    font-size: 1rem;
}
</style>