<template>
  <div id="app">
    <div class="background"></div>
    <header class="header">
      <img class="header__decoration-left" src="../public/logo-decoration.png" alt="Main logo" />
      <img class="header__logo" src="../public/logo.png" alt="Left side logo decoration" />
      <div class="header__decoration-right" title="Right side logo decoration"></div>
      <h1>Large music database</h1>
    </header>
    <form method="get" v-on:submit.prevent>
      <input v-model="search" @input="loadingThenShowItems" 
      type="search" 
      aria-label="Enter search text" 
      placeholder="find artists, titles, albums and more..." 
      spellcheck="false">
    </form>
    <div class="quotes">
      <p>{{ quotes[randomNumber].quote }}</p>
      <p>- {{ quotes[randomNumber].author }}</p>
    </div>
    <div v-if="loading">Loading...</div>
    <section class="items__container">
      <div v-show="!loading" v-for="(item, index) in items" :key="item.length" class="items__song" @click="chooseItem(item)">
        <p>{{ index + 1 }}.</p>
        <img :src="item.thumbnail" alt="Album cover">
        <p>{{ item.description }}</p>
      </div>
    </section>
    <choosen-song v-show="showComp" 
    :embedUrl="embedUrl" 
    :noVideoAlert="noVideoAlert"
    @exit="exitComp"></choosen-song>
  </div>
</template>

<script>
import debounce from 'debounce'
import choosenSong from './components/choosenSong.vue'
import quotes from './data/quotes.json'

export default {
  name: 'App',
  components: {
    'choosen-song': choosenSong
  },
  data() {
    return {
      search: '',
      items: [],
      key: 1,
      showComp: false,
      token: 'e6BVaO8SJJ0-FYN8GAcyJUAZO3TCGsbQHzOl99-vfMfjkm57ppuPaqR61gImTbyB',
      embedUrl: '',
      noVideoAlert: false,
      loading: false,
      quotes: quotes,
      randomNumber: Math.floor(Math.random() * 10)
    }
  },
  methods: {
    loadingThenShowItems: function() {
        this.loading = true;
        this.showItems();
    },
    showItems: function() {
      this.$http.get('http://api.genius.com/search?access_token=' + this.token + '&q=' + this.search).then(function(data){
        console.log(data);
        this.loading = false;
        this.items = data.body.response.hits.map(function(hit){
          return {
            content: hit.result.url,
            description: hit.result.title + ' by ' + hit.result.primary_artist.name,
            thumbnail: hit.result.header_image_thumbnail_url,
            apiPath: hit.result.api_path,
          }
        });
      })
    },
    chooseItem: function(item) {
      this.showComp = !this.showComp;
      this.noVideoAlert = false;
      this.loading = true;
      this.$http.get('http://api.genius.com' + item.apiPath + '?access_token=' + this.token).then(function(data){
        this.loading = false;
        this.item = data;
        let str = this.item.body.response.song.media;
        for(var i = 0; i < str.length; i++) {
          if(str[i].url.charAt(11) == 'y') {
            str = this.item.body.response.song.media[i].url;
            break;
          }
        }
        let res = str.split("=");
        this.embedUrl = "https://www.youtube.com/embed/" + res[1] + "?autoplay=1";
      }).catch(() => {
        this.noVideoAlert = true;
      });
    },
    exitComp: function(value) {
      this.showComp = value;
      this.embedUrl = '';
    }
  },
  created() {
    this.showItems = debounce(this.showItems, 1000);
  }
}
</script>

<style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css?family=Lexend+Giga&display=swap');
  $defaultColor: #00bed7;
  $defaultBg: #dff5fd;
  @mixin font {
    font-family: 'Lexend Giga', sans-serif;
    letter-spacing: -2.3px;
  }
  #app {
    @include font;
    position: relative;
    min-height: 100%;
    height: auto;
    text-align: center;
  }
  .background {
    position: absolute;
    height: 100vh;
    width: 100vw;
    background: $defaultBg;
    clip-path: polygon(-3% 28%, 95% 11%, 72% 24%, 55% 38%, 43% 72%, 41% 93%);
    z-index: -1;
  }
  .header {
    position: relative;
    width: 100vw;
    height: 15vw;
    padding-top: 10px;
  }
  .header__decoration-left {
    object-fit: contain;
    width: 8vw;
    height: 15vw;
  }
  .header__logo {
    object-fit: contain;
    width: 30vw;
    height: 15vw;
  }
  .header__decoration-right {
    display: inline-block;
    background: url(../public/logo-decoration.png);
    background-size: contain;
    background-repeat: repeat-x;
    width: 62vw;
    height: 15vw;
  }
  h1 {
    font-family: 'Lexend Giga', sans-serif;
    position: absolute;
    letter-spacing: -.4vw;
    right: 15vw;
    bottom: 3.6vw;
    font-size: 3vw;
    font-weight: 800;
    text-shadow: 0 0 5px #FFF, 0 0 10px #FFF, 0 0 15px #FFF, 0 0 20px #FFF, 0 0 30px #FFF, 0 0 40px #FFF, 0 0 55px #FFF, 0 0 75px #FFF;
  }
  @keyframes fade-in {
    0% { transform: translateX(-50px); opacity: 0 }
    100% { transform: translateX(0px); opacity: 1 }
  }
  .items__container {
    margin: 0 auto;
  }
  .items__song {
    border-bottom: 2px solid $defaultColor;
    padding: 12px;
    background: rgba(255, 255, 255, .8);
    width: 950px;
    margin: 20px auto;
    left: 45%;
    cursor: pointer;
    font-size: 20px;
    transition: background .3s,  border-bottom  .3s;
    display: grid;
    align-items: center;
    grid-column: span 5 / auto;
    grid-template-columns: 140px 150px auto 50px 40px;
    animation: fade-in 1s 0s forwards;
    &:hover {
      background: whitesmoke;
      border-bottom: 2px solid grey;
    }
    img {
      width: 100px;
      height: 100px;
      align-self: start;
      box-shadow: 5px 5px 14px -6px rgba(0,0,0,0.85);
    }
  }
  input {
    margin: 90px 0 45px;
    width: 700px;
    height: 60px;
    font-size: 32px;
    border: 0;
    border-bottom: 5px $defaultColor solid;
    padding: 8px 18px;
    background: whitesmoke;
    text-transform: uppercase;
    box-shadow: 0px 0px 70px 0px rgba(255,255,255,1);
    &:focus {
      outline: none;
    }
    &::placeholder {
      @include font;
      letter-spacing: -5px;
      text-transform: capitalize;
      text-align: center;
      margin: 5px 10px;
    }
    &:focus::placeholder {
      color: transparent;
    }
  }
  .quotes {
    position: absolute;
    bottom: 0;
    margin-bottom: 80px;
    width: 100%;
    p {
      margin: 7px auto;
      max-width: 450px;
    }
  }
</style>