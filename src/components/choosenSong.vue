<template>
  <div id="show-item">
    <p>{{ songPath }}</p>
    <iframe width="420" height="315"
      :src="myUrl"
      frameborder="0" allowfullscreen>
    </iframe>
    <a @click="exit">X</a>
  </div>
</template>

<script>

export default {
  name: 'choosenSong',
  props: {
    songPath: String,
  },
  data() {
    return {
      item: [],
      myUrl: ''
    }
  },
  methods: {
    exit: function() {
      this.$emit('exit', false);
    }
  },
  beforeUpdate() {
      const token = 'e6BVaO8SJJ0-FYN8GAcyJUAZO3TCGsbQHzOl99-vfMfjkm57ppuPaqR61gImTbyB';
      this.$http.get('http://api.genius.com' + this.songPath + '?access_token=' + token).then(function(data){
        console.log(data);
        this.item = data
        let str = this.item.body.response.song.media[0].url;
        let res = str.split("=");
        this.myUrl = "https://www.youtube.com/embed/" + res[1] + "?autoplay=1";
      })
  }
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

