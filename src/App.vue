<template>
  <div id="app">
    <div class="background"></div>
    <header class="header" :class="{ 'header--thin': inputIsFilled }">
      <img class="header__decoration-left" :class="{ 'header__decoration-left--thin': inputIsFilled }" src="../public/logo-decoration.png" alt="Main logo" />
      <img class="header__logo" :class="{ 'header__logo--thin': inputIsFilled }" src="../public/logo.png" alt="Left side logo decoration" />
      <div class="header__decoration-right" :class="{ 'header__decoration-right--thin': inputIsFilled }" title="Right side logo decoration"></div>
      <h1 class="header__text" :class="{ 'header__text--thin': inputIsFilled }">Large music database</h1>
    </header>
    <form class="form" method="get" v-on:submit.prevent>
      <input class="form__input" :class="{ 'form__input--margin': inputIsFilled }"
      v-model="search" @input="loadingThenShowItems" 
      type="search" 
      aria-label="Enter search text" 
      placeholder="find artists, titles, albums and more..." 
      spellcheck="false"
      />
      <transition-group tag="ul" name="slide-in" class="items__container">
        <li v-show="!loading && search != ''" v-for="(item, index) in items" :key="index++" class="items__song" @click="chooseItem(item)">
          <p>{{ index }}.</p>
          <img :src="item.thumbnail" alt="Album cover" />
          <p>{{ item.description }}</p>
        </li>
      </transition-group>
    </form>
    <div class="quotes" :class="{ 'quotes--fadeout': inputIsFilled }">
      <p>{{ quotes[randomNumber].quote }}</p>
      <p>- {{ quotes[randomNumber].author }}</p>
    </div>
    <transition name="fade">
      <player v-show="showComp"
      :token="token"
      :songPath="songPath"
      @exit="exitComp">
      </player>
    </transition>
    <transition name="fade">
      <loading-comp v-if="loading"></loading-comp>
    </transition>
  </div>
</template>

<script>
import debounce from 'debounce'
import Player from './components/Player.vue'
import loadingComp from './components/loadingComp.vue'
import quotes from './data/quotes.json'

export default {
  name: 'App',
  components: {
    'player': Player,
    'loading-comp': loadingComp
  },
  data() {
    return {
      search: '',
      items: [],
      key: 1,
      showComp: false,
      token: 'e6BVaO8SJJ0-FYN8GAcyJUAZO3TCGsbQHzOl99-vfMfjkm57ppuPaqR61gImTbyB',
      songPath: '',
      loading: false,
      quotes: quotes,
      randomNumber: Math.floor(Math.random() * 10),
      inputIsFilled: false
    }
  },
  methods: {
    inputToMiddle: function() {
      if (this.search == "") {
          this.inputIsFilled = false;
      }
    },
    loadingThenShowItems: function() {
        this.loading = true;
        this.showItems();
    },
    showItems: function() {
      this.$http.get('http://api.genius.com/search?access_token=' + this.token + '&q=' + this.search).then(function(data){
        this.loading = false;
        this.inputIsFilled = true;
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
      this.songPath = item.apiPath;
    },
    exitComp: function(value) {
      this.showComp = value;
    }
  },
  created() {
    this.loadingThenShowItems = debounce(this.loadingThenShowItems, 900);
    this.showItems = debounce(this.showItems, 500);
  },
  updated() {
    this.inputToMiddle();
  }
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Lexend+Giga&display=swap');

  $defaultColor: #00bed7;
  $defaultBg: #dff5fd;

  $defaultHeaderHeight: 200px;
  $headerLeftWidth: 100px;
  $headerLogoWidth: 375px;
  $headerRightWidth: calc(#{$headerLogoWidth} + #{$headerLeftWidth});

  $defaultHeaderHeightThin: calc(#{$defaultHeaderHeight} - 50px);
  $headerLeftWidthThin: calc(#{$headerLeftWidth} - 30px);
  $headerLogoWidthThin: 375px;
  $headerRightWidthThin: calc(#{$headerLogoWidth} + #{$headerLeftWidth});

  @mixin font {
    font-family: 'Lexend Giga', sans-serif;
    letter-spacing: -2.3px;
  }
  @mixin items-slide-in {
    @keyframes slide-in {
      0% { transform: translateX(-50px); opacity: 0 }
      100% { transform: translateX(0px); opacity: 1 }
    }
    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation: slide-in 1s ease-out #{300ms + ($i * 100ms)} forwards;
      }
    }
  }

  .fade-enter, .fade-leave-to,
  .slide-in-leave-active, .slide-in-enter-active {
    opacity: 0;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s ease-in-out;
  }
  .slide-in-enter-active {
    @include items-slide-in;
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
    width: 100%;
    background: $defaultBg;
    clip-path: polygon(-3% 28%, 95% 11%, 72% 24%, 55% 38%, 43% 72%, 41% 93%);
    z-index: -1;
  }
  .header {
    position: relative;
    width: 100%;
    height: $defaultHeaderHeight;
    padding-top: 10px;
    transition: height .2s;
  }
  .header__decoration-left {
    position: absolute;
    left: 0%;
    object-fit: contain;
    width: $headerLeftWidth;
    height: $defaultHeaderHeight;
    transition: left .2s, width .2s;
  }
  .header__logo {
    position: absolute;
    left: $headerLeftWidth;
    object-fit: contain;
    width: $headerLogoWidth;
    height: $defaultHeaderHeight;
    transition: left .2s, width .2s;
  }
  .header__decoration-right {
    position: absolute;
    left: $headerRightWidth;
    display: inline-block;
    background: url(../public/logo-decoration.png);
    background-size: contain;
    background-repeat: repeat-x;
    width: 100%;
    height: $defaultHeaderHeight;
    transition: left .2s, width .2s;
  }
  .header__text {
    position: absolute;
    letter-spacing: -5px;
    right: 15vw;
    height: $defaultHeaderHeight;
    line-height: $defaultHeaderHeight;
    margin: 0;
    font-size: 38px;
    transform: scale(1);
    font-weight: 800;
    text-shadow: 0 0 5px #FFF, 0 0 10px #FFF, 0 0 15px #FFF, 0 0 20px #FFF, 0 0 30px #FFF, 0 0 40px #FFF, 0 0 55px #FFF, 0 0 75px #FFF;
    transition: transform .2s, right .2s;
  }
  header.header--thin, img.header__decoration-left--thin, img.header__logo--thin, div.header__decoration-right--thin {
    height: $defaultHeaderHeightThin;
  }
  .header__decoration-left--thin {
    width: $headerLeftWidthThin;
  }
  .header__logo--thin {
    width: calc(#{$headerLogoWidth} - 100px);
    left: $headerLeftWidthThin;
  }
  .header__decoration-right--thin {
    left: calc(#{$headerRightWidth} - 130px);
  }
  h1.header__text--thin {
    height: $defaultHeaderHeightThin;
    line-height: $defaultHeaderHeightThin;
    right: $defaultHeaderHeightThin;
    transform: scale(.9);
  }
  .items__container {
    position: relative;
    margin: 0 auto;
  }
  .items__song {
    border-bottom: 2px solid $defaultColor;
    padding: 12px;
    background: rgba(255, 255, 255, .8);
    width: 950px;
    margin: 20px auto;
    cursor: pointer;
    font-size: 20px;
    transition: background .3s,  border-bottom  .3s;
    display: grid;
    align-items: center;
    grid-column: span 5 / auto;
    grid-template-columns: 140px 150px auto 50px 40px;
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
  .form__input {
    margin: 14vh 0 45px;
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
    &::-ms-input-placeholder {
      letter-spacing: 2px;
    }
    &:focus::placeholder {
      color: transparent;
    }
  }
  .form__input--margin {
    margin: 40px 0 40px;
    transition: margin .4s;
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
  .quotes--fadeout {
    transition: all .3s;
    opacity: 0;
    bottom: -150px;
  }
</style>