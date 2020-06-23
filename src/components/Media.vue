<template>
<div class="player__video">
    <div class="wrapper" v-show="!miniPlayer">
        <youtube :video-id="embedUrl" :player-vars="playerVars" ref="youtube" width="100%" height="100%"></youtube>
    </div>
    <div class="player__overlay">
        <div class="controls">
            <input class="controls__progressbar" type="range" value="0" @input="calculateNewTime($event)" ref="progressBar">
            <div class="controls__timer">
                <span ref="currentTime"></span> / <span ref="duration"></span>
            </div>
            <div class="controls__btns">
                <button @click="stopVideo">
                    <svg xmlns="http://www.w3.org/2000/svg" height="45" width="45" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 6h12v12H6z" />
                    </svg>
                </button>
                <button @click="pauseVideo">
                    <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                </button>
                <button @click="playVideo">
                    <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'Media',
    props: {
        embedUrl: String,
        miniPlayer: Boolean
    },
    data() {
        return {
            playerVars: {
                autoplay: 1,
                controls: 0,
                modestbranding: 1,
                showinfo: 0,
                wmode: 'opaque',
                enablejsapi: 1,
                origin: window.location.origin,
                rel: 0,
                // cc_load_policy: 3,
                iv_load_policy: 3
            },
        }
    },
    computed: {
        player() {
            return this.$refs.youtube.player
        }
    },
    methods: {
        playVideo() {
            this.player.playVideo();
        },
        pauseVideo() {
            this.player.pauseVideo();
        },
        stopVideo() {
            this.player.stopVideo();
        },
        updateTimerDisplay() {
            this.player.getCurrentTime().then(async (result) => {
                this.$refs.currentTime.textContent = this.formatTime(result);
                this.currentTimeCalculate = result;
            });
            this.player.getDuration().then(async (result) => {
                this.$refs.duration.textContent = this.formatTime(result);
                this.durationCalculate = result;
            });
        },
        calculateNewTime(e) {
            var newTime = this.durationCalculate * (e.target.value / 100);
            this.currentTimeCalculate = newTime;
            this.player.seekTo(newTime);
        },
        updateProgressBar() {
            this.$refs.progressBar.value = (this.currentTimeCalculate / this.durationCalculate) * 100;
        },
        formatTime(time) {
            time = Math.round(time);
            var minutes = Math.floor(time / 60),
                seconds = time - minutes * 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            return minutes + ":" + seconds;
        },
        initialize() {
            this.time_update_interval = setInterval(() => {
                this.updateTimerDisplay();
                this.updateProgressBar();
            }, 100)
        }
    },
    mounted() {
        this.initialize();
    }
}
</script>

<style lang="scss" scoped>
.player__video {
    position: relative;
    left: 0;
    height: 50%;
}

.wrapper {
    height: 100%;
}

.player__overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.controls {
    background: rgba(7, 7, 7, 0.8);
    fill: white;
    bottom: 0;
    position: absolute;
    width: 100%;
}

.controls__progressbar {
    width: calc(100% - 16px);
    height: 7px;
    border-radius: 10px;
    margin: 0 8px 10px;
    cursor: pointer;
}

.controls__timer {
    color: white;
    margin: 0 8px;
}

.controls__btns {
    display: flex;
    justify-content: center;

    button {
        background: transparent;
        border: 0;
        cursor: pointer;
    }
}
</style>
