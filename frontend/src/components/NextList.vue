<template>
    <div>
        <div class="card mt-5 p-0 w-full hover:bg-base-content hover:text-black cursor-pointer border-base-content border-2 "
            v-for="e in next" :key="e.pid" @click="go(e.pid)">
            <div class="card-body p-5">
                <h2 class="card-title">{{ e.name }}</h2>
                <p class="text-left mt">{{ e.description }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        next: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        go(pid) {
            this.$router.push("/game/" + pid)
        }
    }
}
</script>

<style scoped>
.card:active:hover {
    animation: button-pop 0s ease-out;
    transform: scale(var(--btn-focus-scale, 0.97));
}
.card:hover {
    border-color: oklch(var(--bc));
}
.card {
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transition-duration: 200ms;
    border-radius: var(--rounded-btn, 0.5rem);
    padding: 0;
    font-weight: 600;
    text-decoration-line: none;
    border-width: var(--border-btn, 1px);
    animation: button-pop var(--animation-btn, 0.25s) ease-out;
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 0 #0000;
}
</style>