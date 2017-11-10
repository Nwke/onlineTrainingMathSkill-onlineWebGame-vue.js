<template>
  <div class="wrapper_page">
    <main>

      <div class="animation_banner">
        <i class="fa fa-bell" aria-hidden="false"></i>
        <span class="text_animation_banner">
          {{ textBanner }}
      </span>
      </div>

      <div class="wrapper_section">
        <div class="wrapper_chat">
          <div class="message_chat_box">
            <h3 class="title_chat">Test0chat</h3>
            <div class="template_message_chat">
              <div class="template_box_chat_avatar rounded-circle">
                <img class="rounded-circle" src="https://thesocietypages.org/socimages/files/2009/05/vimeo.jpg" alt="avatar-user">
              </div>
              <span class="template_message"><span class="name_user_chat text_red">EVgeny:</span> <span>Hellow may</span> </span>
              <span class="message_time text-secondary font-italic">23:47:51</span>
            </div>
          </div>
          <div class="chat_footer">
            <form class="form_send_message" @submit="sendMessage">
              <input class="form-control send_message_field" type="text" value="send" placeholder="Текст сообщения" v-model="textMessage">
              <button class="btn btn_submit" type="submit">
                Отправить
                <i class="fa fa-paper-plane" aria-hidden="true"></i>
              </button>
            </form>
          </div>
        </div>
        <div class="user_info">
          <h3 class="info_title"><i class="fa fa-id-card" aria-hidden="true"></i> Карточка пользователя</h3>
          <div class="avatar_box">
            <img class="info_avatar" src="https://thesocietypages.org/socimages/files/2009/05/vimeo.jpg" alt="avatar-user">
          </div>
          <span class="template_user_info">Ваш ник: <span class="text_green"> {{ $store.state.userData.login}} </span></span>
          <span class="template_user_info">Статус: <span class="text_green">Online</span></span>
          <span class="template_user_info" >Вход выполнен: <span :class="$store.state.userData.loginSuccess === true ? ' text_green' : 'text_red'"> {{ $store.state.userData.loginSuccess === true ? 'Да' : 'Нет'}} </span></span>
          <span class="template_user_info">Текущий рейтинг: <span class="text_green"> {{ $store.state.userData.raiting }} </span></span>
          <label>Сменить аватар:
            <input type="file" value="Сменить аватар" @change="avatarLoaded" accept="image/*">
          </label>
        </div>
      </div>
      <div class="wrapper_section_games">
        <div class="section_settings_game">
          <h2 class="settings_game_title">Настройки игры</h2>
          <fieldset>
            <form class="settings_create_game" @submit="createGame">
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
              <button class="btn_submit btn_create_game" title="Только для авторизованных пользователей" type="submit">
                <span> Создать игру</span>
                <i class="fa fa-gamepad" aria-hidden="true"></i>
              </button>
            </form>
          </fieldset>
          <hr>
        </div>
        <div class="section_list_games">
          <h2 class="settings_game_title">Список игр</h2>
          <div class="template_game" v-for="game in listGames">
            <table class="table table_game" data->
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
            <button title="Только для авторизованных пользователей" type="button" class="btn_submit connect_game_btn" :data-uid-game="game.uidGame" :data-name-game="game.nameGame" @click="connectToGame">
              <i class="fa fa-users" aria-hidden="true"></i>
              <span>Присоединиться</span>
            </button>
          </div>
        </div>
      </div>
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
      this.getCurrentTime();
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
        if (!this.$store.state.userData.loginSuccess) return this.callAnimationBanner();
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
        if (!this.$store.state.userData.loginSuccess) return this.callAnimationBanner();
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
        e.preventDefault();
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

        templateBoxMessage.classList.add('template_message_chat');
        boxAvatar.classList.add('template_box_chat_avatar', 'rounded-circle');
        avatar.classList.add('rounded-circle');
        spanFullMessage.classList.add('template_message');
        spanNameUser.classList.add('name_user_chat', 'text_red');
        spanTime.classList.add('message_time', 'text-secondary', 'font-italic');

        avatar.src = document.querySelector('.info_avatar').src;
        spanNameUser.innerText = `${nameUser}:`;
        spanTextUser.innerText = `${messageServer.data.text}`;
        spanTime.innerText = `${time}`;

        spanFullMessage.appendChild(spanNameUser);
        spanFullMessage.appendChild(spanTextUser);
        boxAvatar.appendChild(avatar);
        templateBoxMessage.appendChild(boxAvatar);
        templateBoxMessage.appendChild(spanFullMessage);
        templateBoxMessage.appendChild(spanTime);
        document.querySelector('.message_chat_box').appendChild(templateBoxMessage);
      },
      avatarLoaded(e) {
        const files  = Array.from(e.currentTarget.files);
        const fileAvatar = files[0];
        document.querySelector('.info_avatar').src = URL.createObjectURL(fileAvatar);
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

  .template_message_chat {
    position: relative;
    margin: 7px;

    border-radius: 6px;
    background: #abf0d1;
  }

  .message_time {
    position: absolute;
    right: 10px;
    top:0;
  }

  .template_message {
    font-size: 13px;
    font-weight: 400;
  }

  .name_user_chat {
    margin-right: 10px;
    font-size: 20px;
  }

  .template_box_chat_avatar {
    display: inline-block;

    margin: 5px 10px;
    margin-right: 5px;
    padding: 1px;

    border: 1px solid crimson;
  }

  .template_box_chat_avatar img {
    width: 35px;
    height: 35px;
  }

  .text_green {
    color: green;
  }

  .text_red {
    color: #ca2341;
    font-weight: bold;
  }


</style>

<style scoped>

  .wrapper_page {
    display: grid;
    grid-template-rows: 1fr 75px;
    grid-template-columns: 1fr;
  }

  main {
    display: grid;
    grid-template-rows: 0.8fr 1fr;
    grid-template-columns: 1fr;
    grid-gap: 50px;
    background: #b8c6df; /* Old browsers */
    background: -moz-linear-gradient(top, #b8c6df 0%, #6d88b7 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, #b8c6df 0%,#6d88b7 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, #b8c6df 0%,#6d88b7 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b8c6df', endColorstr='#6d88b7',GradientType=0 ); /* IE6-9 */
    padding: 50px;
  }


  .wrapper_section_games {
    display: grid;
    grid-template-rows: 1fr 3fr;
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

  .section_settings_game {
    -moz-border-radius-topleft: 5px;
    -moz-border-radius-topright: 5px;
   }

  .settings_game_title {
   text-align: center;
  }

  .settings_create_game {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    margin: 10px;
  }

  .section_settings_game label {
    margin-bottom: 0;
  }

  .btn_create_game {
    display: flex;
    justify-content: space-around;
    align-items: center;


    font-size: 24px;
  }

  .section_list_games {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    padding: 5px;

    font-weight: bold;
  }

  .template_game {
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

  .connect_game_btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .connect_game_btn .fa {
    margin-right: 15px;
  }



  .разделМеждуСекциями {}

  .wrapper_section {
    display: grid;
    grid-template-rows: minmax(300px, 500px);
    grid-template-columns: 3fr 335px;
    grid-gap: 20px;
  }

  .wrapper_chat {
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

  .message_chat_box {
    overflow-y: scroll;
    background: #f3f3f3;
    box-shadow: inset 0px 0px 10px rgba(0,0,0,0.9);
  }

  .title_chat {
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

  .chat_footer {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }

  .form_send_message {
    display: grid;
    grid-template-rows: 40px;
    grid-template-columns: 5fr 1fr;
    grid-gap: 20px;

  }

  .send_message_field {
    border: 1px solid #cccccc;
    border-radius: 3px;
    background: #ffffff;
    font-size: 15px;
    padding: 10px;
  }

  .btn_submit {
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

  .btn_submit:after {
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

  .btn_submit:hover, .btn_submit:active, .btn_submit:focus {
    background: #2bbbae;
  }

  .btn_submit:focus:not(:active)::after {
    animation: ripple 0.8s ease-out;
  }


  .user_info {
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

  .info_title {
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

  .avatar_box {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 170px;
    height: 170px;
    margin: 25px 20%;

    border: 2px solid #a3cc3e;
    border-radius: 50%;
  }

  .info_avatar {
    width: 140px;
    height: 140px;
    margin: 5px;

    border-radius: 50%;
    border: 2px solid gray;
  }

  .template_user_info {
    display: block;

    margin: 10px 0;

    font-weight: bold;
    font-size: 16px;
  }
</style>
