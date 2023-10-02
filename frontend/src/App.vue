<template>
  <div class="navbar bg-transparent" v-if="$router.currentRoute.value.path != '/'">
    <a @click="$router.push('/')" class="btn btn-ghost normal-case text-xl">首页</a>
  </div>
  <router-view></router-view>
</template>

<script>
;(async function() {
  document.body.style.backgroundImage = 'url("' + (await import(`./assets/bg${parseInt(Math.random() * 7 + 1)}.png`)).default + '")'
})()
</script>

<style>
body {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: right;
  min-height: 100vh;
}
</style>