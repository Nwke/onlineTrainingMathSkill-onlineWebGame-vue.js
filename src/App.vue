<template>
  <div id="app">
    <header class="main-header">
      <div class="main-header__content">
        <section class="content__section-btn">
          <router-link :to="{name: 'Lobby'}" tag="button" class="btn btn_router" id="backButton">
            <i class="fa fa-reply" aria-hidden="true"></i>
            {{ $store.state.nameControlButton }}
          </router-link>
        </section>
        <section class="content__section-btn">
          <router-link :to="{name: 'RatingPage'}" tag="button" class="btn btn_router">
            <i class="fa fa-trophy" aria-hidden="true"></i>
            Рейтинг
          </router-link>
          <router-link :to="{name: 'Auth', params: {modePage: 'login'}}" tag="button" class="btn btn_router">
            <i class="fa fa-user" aria-hidden="true"></i>
            Войти
          </router-link>
          <router-link :to="{name: 'Auth', params: {modePage: 'registration'}}" tag="button" class="btn btn_router">
            <i class="fa fa-user-plus" aria-hidden="true"></i>
             Регистрация
          </router-link>
        </section>
      </div>
    </header>

    <router-view>

    </router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      socket: null
    }
  },
  created() {
    this.socket = new WebSocket('ws://test0chat.ddns.net:8000');
    this.$store.commit('setConnectFromServer', this.socket);
  },
  watch: {
    '$route': function () {
      const arrayDisabledButtons = document.querySelectorAll('.content__section-btn')[1].querySelectorAll('button');
      if (this.$router.currentRoute.name === 'Game') {
        this.$store.commit('setNameControlButton', 'Покинуть текущую игру');
        arrayDisabledButtons.forEach(elem => elem.disabled = true);
      } else {
        this.$store.commit('setNameControlButton', 'Лобби');
        arrayDisabledButtons.forEach(elem => elem.disabled = false);
      }
    },
    '$store.state.gameStarted': function () {
      let btnBack = document.querySelector('#backButton');
      if (this.$store.state.gameStarted) {
        btnBack.disabled = true;
      } else {
        btnBack.disabled = false;
      }
    }
  }
}
</script>

<style>

  /* COMPONENT BANNER START */

  .animation_banner {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 6%;
    bottom: 0;

    color: black;
    font-size: 23px;
    z-index: 1;
    background: rgba(139,197,65, 1);
  }

  .animation_banner__hidden {
   opacity: 0;
  }

  .text_animation_banner {
    margin-left: 15px;
  }

  /* COMPONENT BANNER END */


  /* COMPONENT BUTTONS START */

  .btn_def {
    position: relative;

    width: auto;
    padding: 3px 7px;

    border: 0;
    border-radius: 3px;
    color: white;
    cursor: pointer;
    overflow: hidden;
    font-weight: 600;
    background: #26a69b;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, .4);
  }

  .btn_def:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, .5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }

  .btn_def:hover, .btn_def:active, .btn_def:focus {
    background: #2bbbae;
  }

  .btn_def:focus:not(:active)::after {
    animation: ripple 0.8s ease-out;
  }

  /* COMPONENT BUTTONS END */


  /* COMPONENT ANIMATION START*/

  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 1;
    }
    20% {
      transform: scale(25, 25);
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(40, 40);
    }
  }

  /* COMPONENT ANIMATION END */




</style>

<style scoped>

  body {
    font-family: 'Open Sans', sans-serif;
  }

  .main-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    width: 100%;
    min-height: 60px;
    padding: 0 10px;
    -moz-border-radius-bottomleft: 5px;
    -moz-border-radius-bottomright: 5px;

    background: -moz-linear-gradient(top, rgba(96,108,136,1) 0%, rgba(96,108,136,0.98) 14%, rgba(64,77,108,0.89) 90%, rgba(63,76,107,0.89) 93%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(96,108,136,1) 0%,rgba(96,108,136,0.98) 14%,rgba(64,77,108,0.89) 90%,rgba(63,76,107,0.89) 93%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(96,108,136,1) 0%,rgba(96,108,136,0.98) 14%,rgba(64,77,108,0.89) 90%,rgba(63,76,107,0.89) 93%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#606c88', endColorstr='#e33f4c6b',GradientType=0 ); /* IE6-9 */
  }

  .main-header__content {
    position: relative;
    display: flex;
    justify-content: space-between;

    height: inherit;
    width: inherit;
  }

  .btn_router {
    position: relative;

    min-width: 150px;
    margin: 5px;

    border: 0;
    color: white;
    cursor: pointer;
    overflow: hidden;
    background: #26a69b;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, .4);
  }

  .btn_router:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, .5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }

  .btn_router:hover, .btn_router:active, .btn_router:focus {
    background: #2bbbae;
  }

  .btn_router:focus:not(:active)::after {
    animation: ripple 0.8s ease-out;
  }

</style>


