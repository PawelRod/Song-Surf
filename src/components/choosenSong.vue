<template>
  <section id="show-item">
    <div class="video">
      <iframe width="420" height="315"
      :src="embedUrl"
      frameborder="0" allowfullscreen allow="autoplay">
      </iframe>
    </div>
    <p v-if="noVideoAlert">Sorry, video not available.</p>
    <button aria-label="Close" @click="exit">X</button>
  </section>
</template>

<script>

export default {
  name: 'choosenSong',
  props: {
    token: String,
    songPath: String
  },
  data() {
    return {
      embedUrl: '',
      noVideoAlert: false,
    }
  },
  methods: {
    exit: function() {
      this.$emit('exit', false);
      this.embedUrl = '';
    }
  },
  watch: {
    songPath: function() {
      this.noVideoAlert = false;
      this.$http.get('http://api.genius.com' + this.songPath + '?access_token=' + this.token).then(function(data){
      let str = data.body.response.song.media;
      for(var i = 0; i < str.length; i++) {
        if(str[i].url.charAt(11) == 'y') {
          str = data.body.response.song.media[i].url;
          break;
        }
      }
      let res = str.split("=");
      this.embedUrl = "https://www.youtube.com/embed/" + res[1] + "?autoplay=1";
      }).catch(() => {
        this.noVideoAlert = true;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  #show-item {
    position: fixed;
    color: white;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .9);
  }
  a {
    position: absolute;
    top: 50px;
    right: 50px;
    font-size: 36px;
    cursor: pointer;
  }
  video::after {
    position: absolute;
    width: 420px; height: 315px;
    top: 0;
    left: 0;
    background: pink;
  }
</style>

