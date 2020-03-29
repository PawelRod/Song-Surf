<template>
  <div id="app">
    <h1>Songs:</h1>
    <input v-model="search" @input="showItems">
    <div v-for="item in items" :key="item.length" class="single-item" @click="chooseItem(item)">
      <p>{{ item.description }}</p>
      <img :src="item.thumbnail">
      <a :href="item.content" target="_blank">Show lyrics</a>
    </div>
    <choosen-song v-show="show" :embedUrl="embedUrl" @exit="exitChild"></choosen-song>
  </div>
</template>

<script>
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
      show: false,
      token: 'e6BVaO8SJJ0-FYN8GAcyJUAZO3TCGsbQHzOl99-vfMfjkm57ppuPaqR61gImTbyB',
      embedUrl: ''
    }
  },
  methods: {
    showItems: function() {
      this.$http.get('http://api.genius.com/search?access_token=' + this.token + '&q=' + this.search).then(function(data){
        this.items = data.body.response.hits.map(function(hit){
          return {
            content: hit.result.url,
            description: hit.result.title + ' by ' + hit.result.primary_artist.name,
            thumbnail: hit.result.header_image_thumbnail_url,
            apiPath: hit.result.api_path,
          }
        });
      });
      if(this.search == "") {
        this.items.slice(10);
      }
    },
    chooseItem: function(item) {
      this.show = !this.show;
      this.$http.get('http://api.genius.com' + item.apiPath + '?access_token=' + this.token).then(function(data){
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
      })
    },
    exitChild: function(value) {
      this.show = value;
      this.embedUrl = '';
    }
  }
}
</script>

<style scoped>
  #app {
    text-align: center;
  }
  .single-item {
    border-bottom: 2px solid black;
  }
  img {
    width: 100px;
    height: 100px;
  }
  a {
    display: block;
    margin: 10px 0;
  }
</style>
