<template>
  <div id="app">
    <div class="background"></div>
    <div class="logo"></div>
    <input v-model="search" @input="loadingThenShowItems" placeholder="find artists, titles, albums and more..." spellcheck="false">
    <div v-if="loading">Loading...</div>
    <div v-show="!loading" v-for="item in items" :key="item.length" class="single-item" @click="chooseItem(item)">
      <p>{{items.indexOf(item)+1}}.</p>
      <img :src="item.thumbnail">
      <p>{{ item.description }}</p>
    </div>
    <choosen-song v-show="showComp" 
    :embedUrl="embedUrl" 
    :noVideoAlert="noVideoAlert"
    @exit="exitComp"></choosen-song>
  </div>
</template>

<script>
import debounce from 'debounce'
import choosenSong from './components/choosenSong.vue'

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
      loading: false
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
    this.showItems = debounce(this.showItems, 1000)
  }
}
</script>

<style lang="scss" scoped>
  $defaultColor: #00bed7;
  $defaultBg: #dff5fd;
  #app {
    text-align: center;
  }
  @keyframes fade-in {
    0% { left: 45%; opacity: 0 }
    100% { left: 50%; opacity: 1 }
  }
  .single-item {
    border-bottom: 2px solid $defaultColor;
    padding: 12px;
    background: white;
    width: 950px;
    margin: 20px 0;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    animation: fade-in 1s 0s forwards;
    cursor: pointer;
    font-size: 20px;
    transition: background .3s,  border-bottom  .3s;
    display: grid;
    align-items: center;
    grid-column: span 5 / auto;
    grid-template-columns: 140px 150px auto 50px 40px;
    &:hover {
      background: $defaultBg;
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
    margin: 30px 0;
    width: 600px;
    height: 50px;
    font-size: 32px;
    border: 0;
    border-bottom: 5px $defaultColor solid;
    padding: 0px 15px;
    background: $defaultBg;
    text-transform: uppercase;
    &:focus {
      outline: none;
    }
    &::placeholder {
      text-transform: capitalize;
      text-align: center;
      margin: 5px 10px;
    }
    &:focus::placeholder {
      color: transparent;
    }
  }
  .logo {
    background: url('../public/logo.png');
    background-size: cover;
    width: 400px;
    height: 250px;
    margin: 0 auto;
  }
  a {
    display: block;
    margin: 10px 0;
  }
</style>
