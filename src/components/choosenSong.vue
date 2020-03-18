<template>
  <div id="show-item">
    <p>{{ songPath }}</p>
  </div>
</template>

<script>

export default {
  name: 'choosenSong',
  props: {
    songPath: String
  },
  data() {
    return {

    }
  },
  methods: {
    // .get('http://api.genius.com/songs/3035222?access_token=' + token) (KENDRICK DNA) e.g.
  },
  created() {

  }
}
</script>

<style scoped>

</style>

