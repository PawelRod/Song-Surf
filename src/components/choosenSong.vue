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
    
  },
  beforeUpdate() {
      const token = 'e6BVaO8SJJ0-FYN8GAcyJUAZO3TCGsbQHzOl99-vfMfjkm57ppuPaqR61gImTbyB';
      this.$http.get('http://api.genius.com' + this.songPath + '?access_token=' + token).then(function(data){
        console.log(data);
      })
  }
}
</script>

<style scoped>

</style>

