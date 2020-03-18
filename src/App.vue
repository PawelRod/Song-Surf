<template>
  <div id="app">
    <h1>Songs:</h1>
    <input v-model="search" @input="showItems">
    <div v-for="item in items" :key="item.length" class="single-item" @click="chooseItem(item)">
      <p>{{ item.description }}</p>
      <img :src="item.thumbnail">
      <a :href="item.content" target="_blank">Show lyrics</a>
    </div>
    <choosenSong :songPath="songPath" />
  </div>
</template>

<script>
import choosenSong from './components/choosenSong.vue'

export default {
  name: 'App',
  components: {
    choosenSong
  },
  data() {
    return {
      search: '',
      items: [],
      key: 1,
      songPath: ''
    }
  },
  methods: {
      showItems: function() {
      const token = 'e6BVaO8SJJ0-FYN8GAcyJUAZO3TCGsbQHzOl99-vfMfjkm57ppuPaqR61gImTbyB';
      this.$http.get('http://api.genius.com/search?access_token=' + token + '&q=' + this.search).then(function(data){
        console.log(data);
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
      this.songPath = item.apiPath;
      console.log(this.songPath);
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
