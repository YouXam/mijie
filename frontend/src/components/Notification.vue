<template>
    <div class="toast toast-top toast-end z-[100]" :style="{ top: index * 75 + 50 + 'px'}" :class="{'select-none': notification.onclick, 'cursor-pointer': notification.onclick}">
        <div class="alert flex" :class="'alert-' + notification.type" @click="onClick()">
            <font-awesome-icon v-if="notification.type=='info'" :icon="['fas', 'circle-info']" />
            <font-awesome-icon v-if="notification.type=='success'" :icon="['fas', 'circle-check']" />
            <font-awesome-icon v-if="notification.type=='warning'" :icon="['fas', 'triangle-exclamation']" />
            <font-awesome-icon v-if="notification.type=='error'" :icon="['fas', 'circle-xmark']" />
            <span>{{ notification.message }}</span>
            
            <button class="btn btn-sm btn-ghost btn-circle" @click.stop="notificationManager.remove(notification.id)">
                <font-awesome-icon :icon="['fas', 'circle-xmark']" />
            </button>
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
    }),
    methods: {
        onClick() {
            if (this.notification.onclick) {
                this.notification.onclick()
            }
            if (this.notification.onClickClose) {
                this.notificationManager.remove(this.notification.id)
            }
        }
    }
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
  