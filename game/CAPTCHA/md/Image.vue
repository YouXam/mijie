<template>
  <div class="image-container" :style="containerStyle" @click="handleClick">
    <img :src="src" class="image" style="aspect-ratio: 1 / 1;" />
  </div>
</template>

<script>
export default {
  name: 'Image',
  props: {
    src: {
      type: String,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    containerStyle() {
      return {
        border: this.selected ? '8px solid rgb(0, 132, 197)' : '0.5px solid #ccc',
        transform: 'scale(1)',
        transition: 'all 0.2s ease',
        boxSizing: 'content-box'
      };
    }
  },
  methods: {
    handleClick() {
      this.$emit('change');
    }
  }
};
</script>

<style scoped>
.image-container {
  display: inline-block;
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
}

.image {
  width: 100%;
  height: 100%;
  display: block;
}
</style>