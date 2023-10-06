<template>
    <div class="join">
        <button :class="btnClass()" @click="onPageChange(currentPage - 1)">&laquo;</button>
        <button v-for="page in pagesToShow" :key="page" :class="btnClass(page)" @click="onPageChange(page)">{{ page }}</button>
        <button :class="btnClass()" @click="onPageChange(currentPage + 1)">&raquo;</button>
    </div>
</template>
  
<script>
export default {
    props: {
        totalPages: {
            type: Number,
            required: true
        },
        currentPage: {
            type: Number,
            required: true
        }
    },
    computed: {
        pagesToShow() {
            if (this.totalPages <= 5) {
                return Array.from({ length: this.totalPages }, (_, i) => i + 1);
            } else if (this.currentPage <= 2) {
                return Array.from({ length: 5 }, (_, i) => i + 1);
            } else if (this.currentPage >= this.totalPages - 1) {
                return Array.from({ length: 5 }, (_, i) => this.totalPages - 4 + i);
            } else {
                return Array.from({ length: 5 }, (_, i) => this.currentPage - 2 + i);
            }
        }
    },
    methods: {
        onPageChange(page) {
            if (page < 1 || page > this.totalPages || page == this.currentPage) return;
            this.$emit('pageChange', page);
        },
        btnClass(page) {
            return {
                'join-item': true,
                'btn': true,
                'btn-active': page === this.currentPage
            };
        }
    }
}
</script>

  