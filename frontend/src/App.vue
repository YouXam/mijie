<template>
  <div class="navbar fixed z-50 bg-base-100 shadow-sm">
    <a tabindex="0" @keydown.enter="$router.push('/')" @click="$router.push('/')"
      class="btn btn-ghost text-xl">
      首页
    </a>
    <div v-if="user.login.value" class="flex justify-end flex-1 px-2" >
      <div class="flex items-stretch">
        <div class="dropdown dropdown-hover dropdown-bottom dropdown-end">
          <label tabindex="0" class="btn m-1 btn-ghost normal-case text-lg" style="font-family: 'Neutraface Text', sans-serif;">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" fill="white"/></svg>
            {{ user.username.value }}
          </label>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-[8rem]">
            <li>
              <router-link to="/settings">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" fill="white"/></svg>
                账户设置
              </router-link>
            </li>
            <li>
              <a @click="logout">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" fill="white"/></svg>
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
  <router-view></router-view>
  <NotificationContainer />
</template>

<script setup>
import NotificationContainer from '@/components/NotificationContainer.vue'
import notificationManager from '@/tools/notification.js'
import { user } from '@/tools/bus'
import { useRouter } from 'vue-router'
const router = useRouter()
const setAfterLogin = () => {
  localStorage.setItem('afterLogin', router.currentRoute.value.fullPath)
}
function logout() {
  localStorage.removeItem("token")
  user.update()
  notificationManager.add({
    message: '成功退出登录',
    type: 'success'
  })
  router.push('/')
}
</script>

