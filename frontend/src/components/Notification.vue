<template>
    <div class="toast toast-top toast-end" :style="{ top: index * 75 + 50 + 'px'}">
        <div class="alert flex" :class="'alert-' + notification.type">
            <svg v-if="notification.type=='info'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <svg v-if="notification.type=='success'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <svg v-if="notification.type=='warning'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <svg v-if="notification.type=='error'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{{ notification.message }}</span>
            <button class="btn btn-sm btn-ghost" @click="notificationManager.remove(notification.id)">OK</button>
        </div>
    </div>
</template>
  
<script>
import notificationManager from '@/tools/notification.js'
export default {
    props: {
        notification: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data: () => ({
        notificationManager
    })
}
</script>

<style scoped>
.toast {
    transition: all 0.2s ease-in-out;
}
.alert {
    color: white;
}
.alert-error {
    background-color: #F87171;
}
.alert-success {
    background-color: #34D399;
}
.alert-info {
    background-color: #60A5FA;
}
.alert-warning {
    background-color: #FBBF24;
}
</style>
  