<template>
  <section id="show-item">
    <article v-for="(item, index) in items" :key="index++">
      <h2>{{ item.description }}</h2>
      <p>{{ item.releaseDate }}</p>
      <p>{{ item.producers }}</p>
    </article>
    <div class="video">
      <iframe width="420" height="315"
      :src="embedUrl"
      frameborder="0" allowfullscreen allow="autoplay">
      </iframe>
    </div>
    <p v-if="noVideoAlert">Sorry, video not available.</p>
    <button class="close-btn" aria-label="Close" @click="exit">X</button>
  </section>
</template>

<script>

export default {
  name: 'Player',
  props: {
    token: String,
    songPath: String
  },
  data() {
    return {
      embedUrl: '',
      noVideoAlert: false,
      items: []
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
        this.items = data.body.response.song.map(function(song){
          return {
            description: song.title + ' by ' + song.primary_artist.name,
            releaseDate: 'Release date: ' + song.release_date,
            producers: 'Producer' + song.producer_artists[0].name
          }
        });
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
  .close-btn {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 36px;
    background: none;
    border: 0;
    cursor: pointer;
  }
  .video {
    iframe {
      position: absolute;
      left: 0;
      width: 50%;
      height: 50%;
    }
  }
</style>

