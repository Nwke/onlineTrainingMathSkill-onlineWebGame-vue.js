<template>
  <div class="wrapper_page">
    <main>
      <div class="animation_banner">
        <i class="fa fa-bell" aria-hidden="false"></i>
        <span class="text_animation_banner">
          {{ textBanner }}
      </span>
      </div>
      <article class="wrapper_sections">
        <section class="sections__section-chat">
          <div class="chat__message-box">
            <h3 class="message-box__title">Test0chat</h3>
            <div class="chat__template-message">
              <div class="template-message__box-avatar rounded-circle">
                <img class="rounded-circle" src="https://thesocietypages.org/socimages/files/2009/05/vimeo.jpg" alt="avatar-user">
              </div>
              <span class="template_message__message"><span class="message__user text-danger">EVgeny:</span> <span>Hellow may</span> </span>
              <span class="teamplte-message__time text-secondary font-italic">23:47:51</span>
            </div>
          </div>
          <div class="chat__footer">
            <form class="footer__form" @submit.prevent="sendMessage">
              <input class="form-control form__message-field" type="text" value="send" placeholder="Текст сообщения" v-model="textMessage">
              <button class="btn btn_def" type="submit">
                Отправить
                <i class="fa fa-paper-plane" aria-hidden="true"></i>
              </button>
            </form>
          </div>
        </section>
        <section class="section__user-card">
          <h3 class="user-card__title"><i class="fa fa-id-card" aria-hidden="true"></i> Карточка пользователя</h3>
          <div class="user-card__avatar-box">
            <img class="avatar-box__img" src="https://thesocietypages.org/socimages/files/2009/05/vimeo.jpg" alt="avatar-user">
          </div>
          <span class="user-card__template-info">Ваш ник: <span class="text-success"> {{ $store.state.userData.login}} </span></span>
          <span class="user-card__template-info">Статус: <span class="text-success">Online</span></span>
          <span class="user-card__template-info" >Вход выполнен: <span :class="$store.state.userData.loginSuccess === true ? ' text-success' : 'text-danger'"> {{ $store.state.userData.loginSuccess === true ? 'Да' : 'Нет'}} </span></span>
          <span class="user-card__template-info">Текущий рейтинг: <span class="text-success"> {{ $store.state.userData.raiting }} </span></span>
          <label>Сменить аватар:
            <input type="file" value="Сменить аватар" accept="image/*" @change="avatarLoaded">
          </label>
        </section>
      </article>

      <article class="block-game">
        <section class="block-game__section-settings">
          <h2 class="text-center">Настройки игры</h2>
          <fieldset>
            <form class="section-settings__form-settings" @submit="createGame">
              <label>
                Выберите уровень сложности
                <select required v-model="dataGame.lvlGame">
                  <option selected value="Легкий">Легкий</option>
                  <option value="Средний">Средний</option>
                  <option value="Выше среднего">Выше среднего</option>
                  <option value="Высокий">Высокий</option>
                </select>
              </label>
              <label>
                Напишите имя игры
                <input type="text" maxlength="10" v-model="dataGame.titleCustomGame" @input="validateNameCustomGame" required>
              </label>
              <button class="btn_def form-settings__btn-submit" title="Только для авторизованных пользователей" type="submit">
                <span> Создать игру</span>
                <i class="fa fa-gamepad" aria-hidden="true"></i>
              </button>
            </form>
          </fieldset>
          <hr>
        </section>
        <section class="block-game__section-list-game">
          <h2 class="text-center">Список игр</h2>
          <div class="section-list-game__template-game" v-for="game in listGames">
            <table class="table" data->
              <thead>
              <tr>
                <th scope="col">Название игры</th>
                <th scope="col">Количество участников</th>
                <th scope="col">Сложность</th>
                <th scope="col">Ник создателя</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{{ game.nameGame }}</td>
                <td>{{ game.countPlayers }}</td>
                <td>{{ game.lvlGame }}</td>
                <td>{{ game.nickUserCreated }}</td>
              </tr>
              </tbody>
            </table>
            <button title="Только для авторизованных пользователей" type="button" class="btn btn_def template-game__btn-connect" :data-uid-game="game.uidGame" :data-name-game="game.nameGame" @click="connectToGame">
              <i class="fa fa-users" aria-hidden="true"></i>
              <span>Присоединиться</span>
            </button>
          </div>
        </section>
      </article>
    </main>
    <footer>
      <div class="section-links">
        <a href="#">От разработчиков</a>
      </div>
      <div class="section-legal">
        2017 copyright
      </div>
    </footer>
  </div>
</template>

<style>

  footer {
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
    grid-gap: 20px;

    background: rgb(66,66,66);
  }

  .section-links a {
    color: #8f8f8f;
  }

  .section-links a:hover {
    color: #e8e8e8;
  }

</style>

<script>
  export default {
    name: 'Lobby',
    data() {
      return {
        socket: null,
        textBanner: 'Сперва вам нужно авторизоваться',

        dataGame: {
          titleCustomGame: '',
          lvlGame: 'Легкий'
        },

        listGames: [

        ],
        textMessage: ''
      }
    },
    created() {
      this.socket = this.$store.state.socket;
      this.socket.addEventListener('message', this.getMessageFromServer);
    },
    beforeDestroy() {
      this.socket.removeEventListener('message', this.getMessageFromServer)
    },
    methods: {
      validateNameCustomGame() {
        this.dataGame.titleCustomGame = this.dataGame.titleCustomGame.replace(/\W+/gi, '');
      },
      createGame(e) {
        e.preventDefault();
//        if (!this.$store.state.userData.loginSuccess) return this.callAnimationBanner();
        const nickUserCreated = this.$store.state.userData.login;
        const nameGame = this.dataGame.titleCustomGame;
        const lvlGame = this.dataGame.lvlGame;
        const uidGame = parseInt(new Date().getTime()/1000);
        console.log(nickUserCreated, nameGame, lvlGame, uidGame);
        this.listGames.push({
          nickUserCreated,
          nameGame,
          lvlGame,
          uidGame,
          countPlayers: 1
        });
        console.log(this.listGames);
      },
      connectToGame(e) {
//        if (!this.$store.state.userData.loginSuccess) return this.callAnimationBanner();
        this.$store.commit('setParticipantGame', true);
        this.$router.push({name: 'Game', params: {nameGame: `${e.currentTarget.dataset.nameGame}`}})
      },
      getMessageFromServer(e) {
        const messageFromServer = JSON.parse(e.data);
        switch (messageFromServer.type) {
          case 'message':
            this.messageFromServerForChat(e);
        }
      },
      messageFromServerForChat(e) {
        const messageFromServer = JSON.parse(e.data);
        console.log(messageFromServer);
        if (messageFromServer.data.time) {
          this.addMessageChat(messageFromServer)
        }
      },
      sendMessage(e) {
        this.socket.send(JSON.stringify({
          type: 'send_message',
          data: {text: this.textMessage}
        }));
        this.textMessage = '';
      },
      addMessageChat(messageServer) {
        console.log('sending message');
        const templateBoxMessage = document.createElement('div');
        const boxAvatar = document.createElement('div');
        const avatar = document.createElement('img');
        const spanFullMessage = document.createElement('span');
        const spanNameUser = document.createElement('span');
        const nameUser = messageServer.data.name === null ? 'Anonymous' : messageServer.data.name;
        const spanTextUser = document.createElement('span');
        const spanTime = document.createElement('span');
        const time = this.getCurrentTime();

        templateBoxMessage.classList.add('chat__template-message');
        boxAvatar.classList.add('template-message__box-avatar', 'rounded-circle');
        avatar.classList.add('rounded-circle');
        spanFullMessage.classList.add('template_message__message');
        spanNameUser.classList.add('message__user', 'text-danger');
        spanTime.classList.add('teamplte-message__time', 'text-secondary', 'font-italic');

        avatar.src = document.querySelector('.avatar-box__img').src;
        spanNameUser.innerText = `${nameUser}:`;
        spanTextUser.innerText = `${messageServer.data.text}`;
        spanTime.innerText = `${time}`;

        spanFullMessage.appendChild(spanNameUser);
        spanFullMessage.appendChild(spanTextUser);
        boxAvatar.appendChild(avatar);
        templateBoxMessage.appendChild(boxAvatar);
        templateBoxMessage.appendChild(spanFullMessage);
        templateBoxMessage.appendChild(spanTime);
        document.querySelector('.chat__message-box').appendChild(templateBoxMessage);
      },
      avatarLoaded(e) {
        const files  = Array.from(e.currentTarget.files);
        const fileAvatar = files[0];
        document.querySelector('.avatar-box__img').src = URL.createObjectURL(fileAvatar);
      },
      getCurrentTime() {
        const date = new Date();
        const hours = date.getHours();
        const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
        const seconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
        return `${hours}:${minutes}:${seconds}`;
      },
      callAnimationBanner() {
        setTimeout(() => {
          document.querySelector('.animation_banner').classList.add('animation_banner_start')
        }, 500);

        setTimeout(() => {
          document.querySelector('.animation_banner_start').classList.remove('animation_banner_start');
          document.querySelector('.animation_banner').classList.add('animation_banner_end');
        }, 3000);

        setTimeout(() => {
          document.querySelector('.animation_banner_end').classList.remove('animation_banner_end')
        }, 7000);
      }
    }
  }
</script>

<style scoped>

  .wrapper_page {
    display: grid;
    grid-template-rows: 1fr 75px;
    grid-template-columns: 1fr;
  }

  main {
    display: grid;
    grid-template-rows: 100px 0.8fr minmax(1fr, 18fr);
    grid-template-columns: 1fr;
    grid-gap: 50px;
    background: #b8c6df; /* Old browsers */
    background: -moz-linear-gradient(top, #b8c6df 0%, #6d88b7 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #b8c6df 0%,#6d88b7 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #b8c6df 0%,#6d88b7 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b8c6df', endColorstr='#6d88b7',GradientType=0 ); /* IE6-9 */
    padding: 50px;
  }


  .block-game {
    display: grid;
    grid-template-rows: 1fr minmax(3fr, 18fr);
    grid-template-columns: 1fr;

    width: 70%;
    margin: 0 auto;
    padding: 10px;

    border: 1px solid gray;
    border-radius: 5px;
    background: rgb(242,246,248); /* Old browsers */
    background: -moz-linear-gradient(top, rgba(242,246,248,1) 0%, rgba(224,239,249,1) 100%, rgba(224,239,249,1) 100%, rgba(181,198,208,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(242,246,248,1) 0%,rgba(224,239,249,1) 100%,rgba(224,239,249,1) 100%,rgba(181,198,208,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(242,246,248,1) 0%,rgba(224,239,249,1) 100%,rgba(224,239,249,1) 100%,rgba(181,198,208,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f6f8', endColorstr='#b5c6d0',GradientType=0 ); /* IE6-9 */
  }

  .block-game__section-settings {
    -moz-border-radius-topleft: 5px;
    -moz-border-radius-topright: 5px;
   }

  .section-settings__form-settings {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    margin: 10px;
  }

  .block-game__section-settings label {
    margin-bottom: 0;
  }

  .form-settings__btn-submit {
    display: flex;
    justify-content: space-around;
    align-items: center;


    font-size: 24px;
  }

  .block-game__section-list-game {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    padding: 5px;

    font-weight: bold;
  }

  .section-list-game__template-game {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 4fr 1fr;

    min-height: 75px;
    margin: 10px;

    border: 1px solid black;
    border-radius: 3px;
  }

  th {
    color: green;
  }

  td {
    color: red;
  }

  .template-game__btn-connect {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .template-game__btn-connect .fa {
    margin-right: 15px;
  }



  .разделМеждуСекциями {}

  .wrapper_sections {
    display: grid;
    grid-template-rows: minmax(300px, 500px);
    grid-template-columns: 3fr 335px;
    grid-gap: 20px;
  }

  .sections__section-chat {
    position: inherit;
    display: grid;
    grid-template-rows: 10fr 1fr;
    grid-template-columns: 1fr;
    grid-gap: 10px;

    padding: 10px;

    border: 1px solid green;
    border-radius: 5px;
    box-shadow: 8px 7px 29px -11px #000000;
    background: rgb(242,246,248); /* Old browsers */
    background: -moz-linear-gradient(top, rgba(242,246,248,1) 0%, rgba(216,225,231,1) 10%, rgba(181,198,208,1) 100%, rgba(224,239,249,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(242,246,248,1) 0%,rgba(216,225,231,1) 10%,rgba(181,198,208,1) 100%,rgba(224,239,249,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(242,246,248,1) 0%,rgba(216,225,231,1) 10%,rgba(181,198,208,1) 100%,rgba(224,239,249,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f6f8', endColorstr='#e0eff9',GradientType=0 ); /* IE6-9 */
  }

  .chat__message-box {
    overflow-y: scroll;
    background: #f3f3f3;
    box-shadow: inset 0px 0px 10px rgba(0,0,0,0.9);
  }

  .message-box__title {
    margin: 5px;
    margin-bottom: 15px;

    font-weight: 800;
    font-size: 2.3em;
    text-align: center;

    color:transparent;
    background: -webkit-linear-gradient(blue, green);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .chat__footer {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }

  .footer__form {
    display: grid;
    grid-template-rows: 40px;
    grid-template-columns: 5fr 1fr;
    grid-gap: 20px;

  }

  .form__message-field {
    border: 1px solid #cccccc;
    border-radius: 3px;
    background: #ffffff;
    font-size: 15px;
    padding: 10px;
  }


  .section__user-card {
    padding: 15px;

    border: 1px solid green;
    border-radius: 10px;
    background: rgb(242,246,248); /* Old browsers */
    background: -moz-linear-gradient(top, rgba(242,246,248,1) 0%, rgba(216,225,231,1) 10%, rgba(181,198,208,1) 100%, rgba(224,239,249,1) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(242,246,248,1) 0%,rgba(216,225,231,1) 10%,rgba(181,198,208,1) 100%,rgba(224,239,249,1) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(242,246,248,1) 0%,rgba(216,225,231,1) 10%,rgba(181,198,208,1) 100%,rgba(224,239,249,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f2f6f8', endColorstr='#e0eff9',GradientType=0 ); /* IE6-9 */
    box-shadow: 11px 11px 29px -11px #000000;
  }

  .user-card__title {
    display: flex;
    justify-content: center;
    align-items: flex-end;

    margin-bottom: 25px;

    text-align: center;
    text-decoration: underline;
    font-weight: 700;
    font-size: 21px;
  }

  .fa-id-card {
    font-size: 25px;
    margin-right: 5px;
  }

  .user-card__avatar-box {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 170px;
    height: 170px;
    margin: 25px 20%;

    border: 2px solid #a3cc3e;
    border-radius: 50%;
  }

  .avatar-box__img {
    width: 140px;
    height: 140px;
    margin: 5px;

    border-radius: 50%;
    border: 2px solid gray;
  }

  .user-card__template-info {
    display: block;

    margin: 10px 0;

    font-weight: bold;
    font-size: 16px;
  }
</style>

<style>

  .fa {
    font-size: 22px;
  }

  .fa-gamepad {
    font-size: 25px;
    margin-left: 5px;
  }

  button {
    cursor: pointer;
  }


</style>
