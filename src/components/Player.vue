<template>
<div class="player" :class="{ 'player--mini': miniPlayer }">
    <div class="player__column player__column--left" v-show="!loading">
        <media :embedUrl="embedUrl" :miniPlayer="miniPlayer">
            <span class="novid-alert" v-if="noVideoAlert" v-show="!miniPlayer">Sorry, video not available.</span>
        </media>
        <section class="player__desc">
            <h2>{{ items.title }}</h2>
            <h3 v-if="embedUrl">by {{ items.primary_artist.name }}</h3>
            <div v-show="!miniPlayer">
                <h4>Release date</h4>
                <span>{{ items.release_date_for_display }}</span>
                <h4>Produced by</h4>
                <span v-for="producer in items.producer_artists" :key="`${producer.id}++`">
                    {{ producer.name }}
                </span>
                <h4>Written by</h4>
                <span v-for="writer in items.writer_artists" :key="`${writer.id}--`">
                    {{ writer.name }}
                </span>
            </div>
        </section>
    </div>
    <article class="player__column player__column--right" v-show="!miniPlayer">
        <transition name="fade">
            <loading-comp v-if="loading"></loading-comp>
        </transition>
        <simplebar data-simplebar-auto-hide="false" :class="{'simplebar-overflow': miniPlayer}">
            <p>{{ lyrics }}</p>
        </simplebar>
    </article>
    <button class="player__btn player__btn--close" aria-label="Close" @click="exit">X</button>
    <button class="player__btn player__btn--minimize" @click="minimize">_</button>
</div>
</template>

<script>
import loadingComp from './loadingComp.vue';
import Media from './Media.vue';
import {
    getLyrics
} from 'genius-lyrics-api'
import simplebar from 'simplebar-vue';
import 'simplebar/dist/simplebar.min.css';

export default {
    components: {
        'loading-comp': loadingComp,
        'media': Media,
        'simplebar': simplebar
    },
    name: 'Player',
    props: {
        token: String,
        songPath: String,
    },
    data() {
        return {
            noVideoAlert: false,
            miniPlayer: false,
            loading: false,
            items: [],
            embedUrl: '',
            lyrics: '',
            currentTimeCalculate: null,
            durationCalculate: null,
        }
    },
    methods: {
        exit() {
            clearInterval(this.time_update_interval);
            this.$emit('exit', false);
            this.embedUrl = '';
        },
        minimize() {
            this.miniPlayer = !this.miniPlayer;
            this.$emit('minimize', !this.miniPlayer);
        },
    },
    watch: {
        songPath() {
            this.$forceUpdate();
            this.loading = true;
            this.lyrics = '';
            this.noVideoAlert = false;
            this.$http.get('http://api.genius.com' + this.songPath + '?access_token=' + this.token).then(function (data) {
                this.items = data.body.response.song;
                const options = {
                    apiKey: this.token,
                    title: this.items.title,
                    artist: this.items.primary_artist.name,
                    optimizeQuery: true
                };
                getLyrics(options).then(lyrics => {
                    this.lyrics = lyrics;
                    this.loading = false;
                });
                let str = data.body.response.song.media;
                for (var i = 0; i < str.length; i++) {
                    if (str[i].url.charAt(11) == 'y') {
                        str = data.body.response.song.media[i].url;
                        break;
                    }
                }
                let res = str.split("=");
                this.embedUrl = res[1];
            }).catch(() => {
                this.noVideoAlert = true;
            });
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../data/scss/_variables.scss';

.player {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
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
    width: 100%;
    top: auto;
    bottom: 0;

    .player__column {
        width: 100%;

        h2,
        h3 {
            display: inline-block;
            margin: 0 10px;
            font-size: 1.5em;
        }
    }

    .player__desc {
        height: 50px;
        width: 100%;
        text-align: center;
        margin: 0 10px 10px;
    }
}

.player--mini:after {
    content: '';
    width: 99%;
    height: 2px;
    background: black;
    margin: 0 auto;
    box-shadow: inset 12px 0 15px -4px white, inset -12px 0 8px -4px white;
}

.player__column {
    height: 100%;
    width: 50%;
}

.player__column--left {
    order: 1;

    h2 {
        margin-top: 0;
    }
}

.player__column--right {
    order: 2;

    p {
        padding: 15px 30px;
        white-space: pre-line;
    }
}

.player__desc {
    margin: 15px 0 0 15px;

    span {
        margin-right: 7px;
    }

    h4 {
        margin-bottom: 5px;
    }
}

.player__btn {
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 36px;
    background: none;
    border: 0;
    cursor: pointer;
}

.player__btn--close {
    right: 30px;
}

.player__btn--minimize {
    right: 90px;
}
</style>
