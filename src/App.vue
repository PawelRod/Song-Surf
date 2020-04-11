<template>
  <div id="app">
    <div class="logo"></div>
    <input v-model="search" @input="loadingThenShowItems">
    <div v-if="loading">Loading...</div>
    <div v-show="!loading" v-for="item in items" :key="item.length" class="single-item" @click="chooseItem(item)">
      <p>{{ item.description }}</p>
      <img :src="item.thumbnail">
      <a :href="item.content" target="_blank">Show lyrics</a>
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
  $defaultBg: #a9d7e6;
  #app {
    text-align: center;
  }
  .single-item {
    border: 3px solid lightblue;
    width: 500px;
    margin: 10px auto;
  }
  input {
    margin: 30px 0;
  }
  img {
    width: 100px;
    height: 100px;
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
