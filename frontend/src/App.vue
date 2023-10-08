<template>
  <div class="navbar fixed z-50 bg-base-100 shadow-sm">
    <router-link tabindex="0" @keydown.enter="$router.push('/')" @click="$router.push('/')" to = '/'
      class="btn btn-ghost sm:text-lg px-2 sm:px-4">
      首页
    </router-link>
    <div class="sm:block hidden">
      <router-link tabindex="0" @keydown.enter="$router.push('/rank')" @click.stop="$router.push('/rank')"
        to = '/rank'
        class="btn btn-ghost text-lg ml-3">
        <font-awesome-icon :icon="['fas', 'ranking-star']" />
        排行榜
      </router-link>
      <router-link tabindex="0" @keydown.enter="$router.push('/graph')" @click.stop="$router.push('/graph')"
        to = '/graph'
        class="btn btn-ghost text-lg ml-3">
        <font-awesome-icon :icon="['fas', 'code-merge']" />
        流程图
      </router-link>
      <router-link tabindex="0" @keydown.enter="$router.push('/notice')" @click.stop="$router.push('/notice')"
        to = '/notice'
        class="btn btn-ghost text-lg ml-3">
        <font-awesome-icon :icon="['fas', 'note-sticky']" />
        公告
      </router-link>
    </div>

    <div class="sm:hidden" >
      <div class="flex items-stretch">
        <div class="dropdown dropdown-hover dropdown-bottom">
          <a tabindex="0" class="btn btn-ghost sm:text-lg px-2 sm:px-4">
            功能
          </a>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-[8rem]">
            <li>
              <router-link to="/rank">
                <font-awesome-icon :icon="['fas', 'ranking-star']" />
                排行榜
              </router-link>
            </li>
            <li>
              <router-link to="/graph">
                <font-awesome-icon :icon="['fas', 'code-merge']" />
                <span class="ml-1">流程图</span>
              </router-link>
            </li>
            <li>
              <router-link to="/notice">
                <font-awesome-icon :icon="['fas', 'note-sticky']" />
                <span class="ml-1">公告</span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <span style="font-family: 'Neutraface Text', sans-serif;" class="text-sm flex justify-end flex-1" v-if="user.login.value">
      <font-awesome-icon class="mr-2" :icon="['fas', 'chart-bar']" />
      {{ user.points.value + " pts" }}
    </span>
    <div v-if="user.login.value" class="flex justify-end" >
      <div class="flex items-stretch">
        <div class="dropdown dropdown-hover dropdown-bottom dropdown-end">
          <label tabindex="0" class="btn m-1 btn-ghost normal-case text-sm sm:text-lg" style="font-family: 'Neutraface Text', sans-serif;">
            <font-awesome-icon :icon="['fas', 'user']" />
            {{ user.username.value }}
          </label>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-[8rem]">
            <li>
              <router-link to="/settings">
                <font-awesome-icon :icon="['fas', 'gear']" />
                账户设置
              </router-link>
            </li>
            <li v-if="user.admin.value > 0">
              <router-link to="/users">
                <font-awesome-icon :icon="['fas', 'address-book']" />
                用户列表
              </router-link>
            </li>
            <li>
              <router-link to="/record">
                <font-awesome-icon :icon="['fas', 'bars-staggered']" />
                提交记录
              </router-link>
            </li>
            <li>
              <a @click="logout">
                <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
                退出登录
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-end flex-1">
      <router-link tabindex="0" @keydown.enter="$router.push('/login')" to="/login" 
        @click="setAfterLogin"
        v-if="$router.currentRoute.value.path != '/login'"
        class="btn btn-ghost">
        登录
      </router-link>
      <router-link tabindex="0" @keydown.enter="$router.push('/register')" to="/register" 
        @click="setAfterLogin"
        v-if="$router.currentRoute.value.path != '/register'"
        class="btn btn-ghost ml-3">
        注册
      </router-link>
    </div>
  </div>
  <div class="h-[72px]"></div>
  <router-view :key="$route.fullPath"></router-view>
  <NotificationContainer />
</template>

<script setup>
import NotificationContainer from '@/components/NotificationContainer.vue'
import notificationManager from '@/tools/notification.js'
import { user, noticeEventListener, rankEventListener } from '@/tools/bus'
import { useRouter } from 'vue-router'
import { notice, rank } from './tools/subscribe'
const router = useRouter()
const setAfterLogin = () => {
  localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
}
function logout() {
  localStorage.removeItem('token')
  user.update()
  notificationManager.add({
    message: '成功退出登录',
    type: 'success'
  })
  router.push('/')
}
rank.subscribe('update', function (message) {
  rankEventListener.dispatchEvent(new CustomEvent('update', {
    detail: message.data
  }))
});
notice.subscribe('update', function (message) {
  notificationManager.add({
    message: message.data.content ? ('公告: ' + message.data.content) : '有新公告',
    type: 'success'
  })
  noticeEventListener.dispatchEvent(new Event('update'))
});



</script>

<style scoped>
.textarea {
  animation: fadeIn var(--animation-duration, 0.5s) ease;
}
</style>
