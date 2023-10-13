<template>Loading...</template>

<script setup>
import { api } from '@/tools/api'
import { useRouter } from 'vue-router'
import { user } from '@/tools/bus'
import notificationManager from '@/tools/notification.js'
void async function () {
    const router = useRouter()
    if (!router.currentRoute.value.query.uid) {
        router.push('/404')
        return
    }
    if (!user.login.value) {
        localStorage.setItem("afterLogin", router.currentRoute.value.fullPath)
        router.push('/login')
        return
    }
    const { pid, content } = await api('/api/hint/' + router.currentRoute.value.query.uid)
    const prer = localStorage.getItem("hints")
    const pre = prer ? JSON.parse(prer) : {}
    if (!pre?.[pid]?.length) {
        pre[pid] = []
    }
    pre[pid].push(content)
    pre[pid] = [...new Set(pre[pid])]
    localStorage.setItem("hints", JSON.stringify(pre))
    notificationManager.add({
        message: '收集到一条线索',
        type: 'success'
    })
    router.replace('/game/' + pid)
}()
</script>