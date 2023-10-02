<template>
    <div class="container mx-auto text-center h-[100vh] flex flex-col items-center justify-center">
        <div class="mt-10 relative">
            <h1 class="text-7xl font-extrabold tracking-tight gradient-text mb-10">
                解谜游戏
            </h1>
            <div class="background w-full h-full">

            </div>
        </div>
        <div class="mt-10 flex flex-col sm:w-1/3 w-2/3">
            <router-link to="/gamerule?start" tag="button" class="btn btn-outline m-2 text-xl">开始游戏</router-link>
            <router-link to="/gamerule" tag="button" class="btn btn-outline m-2 text-xl">游戏规则</router-link>
            <router-link to="/about" tag="button" class="btn btn-outline m-2 text-xl">关于</router-link>
        </div>
    </div>
</template>
  
<script>
</script>
  
<style scoped>
.background {
    position: absolute;
    background-image: linear-gradient(-45deg, #f06d06 50%, #f200ff 50%);
    filter: blur(90px);
    top: 0;
    z-index: -1;
}
.gradient-text {
    background: linear-gradient(-45deg, #f06d06, #f200ff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
  