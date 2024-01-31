<template>
    <TitleCard title="管理面板" class="mb-20">
        <template #subtitle><div class="mt-10"></div></template>
        <div class="w-full flex flex-col mx-auto">
            <label class="label">
                <span class="label-text">开始时间</span>
            </label>
            <input type="text" class="input input-bordered w-full max-w-md" v-model="startTime" @blur="put(5)"/>
            
            <label class="label">
                <span class="label-text">结束时间</span>
            </label>
            <input type="text" class="input input-bordered w-full max-w-md" v-model="endTime" @blur="put(1)"/>
            <label class="label mt-5">
                <span class="label-text">游戏规则</span>
            </label>
            <textarea class="textarea" style="border-color: hsl(var(--bc) / 0.2)" placeholder="Markdown格式"
                v-model="gamerule"
                ref="gameruleTextarea"
                v-auto-expand
                @blur="put(2)"
            ></textarea>
            <label class="label mt-5">
                <span class="label-text">游戏结束文本</span>
            </label>
            <textarea class="textarea" style="border-color: hsl(var(--bc) / 0.2)" placeholder="Markdown格式"
                v-model="gameover"
                ref="gameoverTextarea"
                v-auto-expand
                @blur="put(3)"
            ></textarea>
            <label class="label mt-5">
                <span class="label-text">关于</span>
            </label>
            <textarea class="textarea" style="border-color: hsl(var(--bc) / 0.2)" placeholder="Markdown格式"
                v-model="about"
                ref="aboutTextarea"
                v-auto-expand
                @blur="put(4)"
            ></textarea>
        </div>
    </TitleCard>
</template>
  
<script setup>
import TitleCard from '@/components/TitleCard.vue';
import { ref, nextTick } from 'vue' 
import { api, apiPut } from '@/tools/api'
import notificationManager from '@/tools/notification.js'
const startTime = ref('')
const endTime = ref('')
const gamerule = ref('')
const gameover = ref('')
const about = ref('')
const gameruleTextarea = ref(null)
const gameoverTextarea = ref(null)
const aboutTextarea = ref(null)
let last = {}
function resize() {
    if (gameruleTextarea.value) {
        gameruleTextarea.value.style.height = 'auto'
        gameruleTextarea.value.style.height = gameruleTextarea.value.scrollHeight + 'px'
    }
    if (gameoverTextarea.value) {
        gameoverTextarea.value.style.height = 'auto'
        gameoverTextarea.value.style.height = gameoverTextarea.value.scrollHeight + 'px'
    }
    if (aboutTextarea.value) {
        aboutTextarea.value.style.height = 'auto'
        aboutTextarea.value.style.height = aboutTextarea.value.scrollHeight + 'px'
    }
}
void async function() {
    const res = await api('/api/game-config')
    startTime.value = new Date(res.startTime).toLocaleString()
    endTime.value = new Date(res.endTime).toLocaleString()
    gamerule.value = res.gamerule
    gameover.value = res.gameover
    about.value = res.about
    last = res
    nextTick(resize);
}()

function put(id) {
    if (id === 5) {
        if (last.startTime == startTime.value) return
        last.startTime = startTime.value
        let time;
        try {
            time = new Date(startTime.value)
            if (isNaN(time.getTime())) throw new Error()
        } catch (e) {
            notificationManager.add({
                message: '时间格式错误',
                type: 'error'
            })
            startTime.value = last.startTime
            return
        }
        startTime.value = time.toLocaleString()
        apiPut('/api/game-config', {
            startTime: time
        })
    
    } else if (id == 1) {
        if (last.endTime == endTime.value) return
        last.endTime = endTime.value
        let time;
        try {
            time = new Date(endTime.value)
            if (isNaN(time.getTime())) throw new Error()
        } catch (e) {
            notificationManager.add({
                message: '时间格式错误',
                type: 'error'
            })
            endTime.value = last.endTime
            return
        }
        endTime.value = time.toLocaleString()
        apiPut('/api/game-config', {
            endTime: time
        })
    } else if (id == 2) {
        if (last.gamerule == gamerule.value) return
        last.gamerule = gamerule.value
        apiPut('/api/game-config', {
            gamerule: gamerule.value
        })
    } else if (id == 3) {
        if (last.gameover == gameover.value) return
        last.gameover = gameover.value
        apiPut('/api/game-config', {
            gameover: gameover.value
        })
    } else if (id == 4) {
        if (last.about == about.value) return
        last.about = about.value
        apiPut('/api/game-config', {
            about: about.value
        })
    }
}

</script>