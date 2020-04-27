<template>
    <div class="loading">
        <div class="loading__box">
            <span class='loading__bar'></span>
            <span class='loading__bar'></span>
            <span class='loading__bar'></span>
            <span class='loading__bar'></span>
            <span class='loading__bar'></span>
            <span class='loading__bar'></span>
            <span class='loading__bar'></span>
            <span class='loading__bar'></span>
            <span class='loading__bar'></span>
            <span class='loading__bar'></span>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'loadingComp',
        data() {
            return {
                items: []
            }
        }
    }
</script>
<style lang="scss" scoped>
    .loading {
        position: fixed;
        left: 0; right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, .8);
    }
    .loading__box {
        height: 30px;
        left: 50%;
        margin: -30px 0 0 -20px;
        position: absolute;
        top: 50%;
        width: 40px;
    }
    .loading__bar {
        background: #00bed7;
        bottom: 1px;
        height: 3px;
        position: absolute;
        width: 3px;      
        animation: sound 0ms -800ms linear infinite alternate;
    }
    @keyframes sound {
        0% {
        opacity: .35;
        height: 3px;
        }
        100% {
        opacity: 1;
        height: 28px;
        }
    }
    .loading__bar:nth-child(1) {
        left: 1px;
        animation-duration: 474ms;
    }
    .loading__bar:nth-child(2) {
        left: 5px;
        animation-duration: 433ms;
    }
    .loading__bar:nth-child(3) {
        left: 9px;
        animation-duration: 407ms;
    }
    .loading__bar:nth-child(4) {
        left: 13px;
        animation-duration: 458ms;
    }
    .loading__bar:nth-child(5) {
        left: 17px;
        animation-duration: 400ms;
    }
    .loading__bar:nth-child(6) {
        left: 21px;
        animation-duration: 427ms;
    }
    .loading__bar:nth-child(7) {
        left: 25px;
        animation-duration: 441ms;
    }
    .loading__bar:nth-child(8) {
        left: 29px;
        animation-duration: 419ms;
    }
    .loading__bar:nth-child(9) {
        left: 33px;
        animation-duration: 487ms;
    }
    .loading__bar:nth-child(10) {
        left: 37px;
        animation-duration: 442ms;
    }
</style>