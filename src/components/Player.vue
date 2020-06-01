<template>
  <section class="player" :class="{ 'player--mini': miniPlayer }">
    <div class="video">
      <iframe width="420" height="315"
      :src="embedUrl"
      frameborder="0" allowfullscreen allow="autoplay">
      </iframe>
    </div>
    <article class="info">
      <h2>{{ items.title }}</h2>
      <h3 v-if="embedUrl">by {{ items.primary_artist.name }}</h3>
      <h4>Release date</h4>
      <span>{{ items.release_date_for_display }}</span>
      <h4>Produced by</h4>
      <span v-for="(producer, index) in items.producer_artists" :key="index">
        {{ producer.name }}
      </span>
      <h4>Written by</h4>
      <span v-for="(writer, index) in items.writer_artists" :key="index + 2">
        {{ writer.name }}
      </span>
    </article>
    <p v-if="noVideoAlert">Sorry, video not available.</p>
    <button class="btn btn--close" aria-label="Close" @click="exit">X</button>
    <button class="btn btn--minimize" @click="miniPlayer = !miniPlayer">_</button>
  </section>
</template>

<script>
import { getLyrics } from 'genius-lyrics-api'
// import { getSong } from 'genius-lyrics-api'

export default {
  name: 'Player',
  props: {
    token: String,
    songPath: String,
  },
  data() {
    return {
      embedUrl: '',
      noVideoAlert: false,
      items: [],
      miniPlayer: false,
      lyrics: ''
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
      this.lyrics = '';
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
        console.log(data)
        this.items = data.body.response.song;
        const options = {
          apiKey: this.token,
          title: this.items.title,
          artist: this.items.primary_artist.name,
          optimizeQuery: true
        };
        getLyrics(options).then(lyrics => this.lyrics = lyrics);
      }).catch(() => {
        this.noVideoAlert = true;
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  .player {
    text-align: left;
    position: fixed;
    color: black;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, .9);
  }
  .player--mini {
    height: 120px;
    width: calc(100% - 16px);
    top: auto;
    bottom: 0;
  }
  .btn {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 36px;
    background: none;
    border: 0;
    cursor: pointer;
  }
  .btn--close {
    right: 30px;
  }
  .btn--minimize {
    right: 90px;
  }
  .video {
    position: relative;
    left: 0;
    width: 50%;
    height: 50%;
    iframe {
      width: 100%;
      height: 100%;
    }
  }
  .info {
    width: 50%;
    margin-left: 15px;
  }
  span {
    margin-right: 7px;
  }
  h4 {
    margin-bottom: 5px;
  }
</style>

