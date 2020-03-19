<template>
  <div id="show-item">
    <p>{{ songPath }}</p>
    <iframe width="420" height="315"
      :src="myUrl"
      frameborder="0" allowfullscreen>
    </iframe>
  </div>
</template>

<script>

export default {
  name: 'choosenSong',
  props: {
    songPath: String
  },
  data() {
    return {
      item: [],
      myUrl: ''
    }
  },
  methods: {
    
  },
  beforeUpdate() {
      const token = 'e6BVaO8SJJ0-FYN8GAcyJUAZO3TCGsbQHzOl99-vfMfjkm57ppuPaqR61gImTbyB';
      this.$http.get('http://api.genius.com' + this.songPath + '?access_token=' + token).then(function(data){
        console.log(data);
        this.item = data
        let str = this.item.body.response.song.media[0].url;
        let res = str.split("=");
        this.myUrl = "https://www.youtube.com/embed/" + res[1];
      })
  }
}
</script>

<style scoped>
  #show-item {
    position: absolute;
    width: 100%;
    height: auto;
    background: black;
  }
  iframe {
    margin: 0 auto;
  }
</style>

