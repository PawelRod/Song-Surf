<template>
  <div id="show-item">
    <p>{{ songPath }}</p>
    <iframe width="420" height="315"
      :src="embedUrl"
      frameborder="0" allowfullscreen allow="autoplay">
    </iframe>
    <a @click="exit">X</a>
  </div>
</template>

<script>

export default {
  name: 'choosenSong',
  props: {
    embedUrl: String,
  },
  data() {
    return {
      item: [],
    }
  },
  methods: {
    exit: function() {
      this.$emit('exit', false);
    }
  },
}
</script>

<style scoped>
  #show-item {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .9);
  }
  a {
    position: absolute;
    top: 50px;
    right: 50px;
    color: white;
    font-size: 36px;
    cursor: pointer;
  }
</style>

