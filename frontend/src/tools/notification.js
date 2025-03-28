import Notification from '@/components/Notification.vue'
import { reactive } from 'vue'


class NotificationManager {
  constructor() {
    this.notifications = reactive([])
    this.id = 0
  }

  add({
    message = '',
    type = 'info',
    time = 3000,
    onclick = null,
    onClickClose = true
  }) {
    const id = this.id++
    const notification = { id, message, type, time, onclick, onClickClose }
    this.notifications.unshift(notification)

    if (time && typeof time === 'number') {
      if (time >= 0) {
        setTimeout(() => {
          this.remove(id)
        }, time)
      }
    }
    return id
  }
  remove(id) {
    const index = this.notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      this.notifications.splice(index, 1)
    }
  }
}

export default new NotificationManager()
