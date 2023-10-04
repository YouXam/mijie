<template>
  <transition-group name="list" tag="div">
    <Notification v-for="(notification, i) in notificationManager.notifications" :key="notification.id" :notification="notification" :index="i"/>
  </transition-group>
</template>
  
<script setup>
import Notification from '@/components/Notification.vue'
import notificationManager from '@/tools/notification.js'
</script>
  
<style>
.list-leave-active {
  transition: all 0.2s ease;
}

.list-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

