<template>
  <section class="chat wow slideInLeft">
    <div class="chat__message-box">
      <h3 class="message-box__title text-center">Test0Chat</h3>
      <div class="chat__template-message">
        <div class="template-message__box-avatar rounded-circle">
          <img class="avatar-box__img rounded-circle" src="https://thesocietypages.org/socimages/files/2009/05/vimeo.jpg" alt="avatar-user">
        </div>
        <span class="template_message__message"><span class="message__user text-danger">EVgeny:</span> <span>Hellow may</span> </span>
        <span class="teamplte-message__time text-secondary font-italic">23:47:51</span>
      </div>
    </div>
    <form class="chat__footer" @submit.prevent="sendMessage">
      <input class="footer__message-field" type="text" placeholder="Сообщение..." v-model="textMessage">
      <button class="btn btn_def" type="submit">
        <span>Отправить</span>
        <i class="fa fa-paper-plane" aria-hidden="true"></i>
      </button>
    </form>
  </section>
</template>


<script>

  export default {
    name: 'chat',
    data() {
      return {
        socket: null,
        textMessage: ''
      }
    },
    created() {
      this.socket = this.$store.state.socket;
      this.socket.addEventListener('message', this.getMessageFromServer);

    },
    beforeDestroy() {
      this.socket.removeEventListener('message', this.getMessageFromServer);
    },
    methods: {
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
        spanNameUser.classList.add('message__user', 'text_red');
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
        document.querySelector('.message_chat_box').appendChild(templateBoxMessage);
      }
    }
  }
</script>


<style scoped>

  .chat {
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
    font-size: 25px;
    text-align: center;

    color:transparent;
    background: -webkit-linear-gradient(blue, green);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .chat__template-message {
    position: relative;
    margin: 7px;

    border-radius: 6px;
    background: #abf0d1;
  }

  .teamplte-message__time {
    position: absolute;
    right: 10px;
    top:0;
  }

  .template_message__message {
    font-size: 13px;
    font-weight: 400;
  }

  .message__user {
    margin-right: 10px;
    font-size: 20px;
  }

  .template-message__box-avatar {
    display: inline-block;

    margin: 5px 10px;
    margin-right: 5px;
    padding: 1px;

    border: 1px solid crimson;
  }

  .template-message__box-avatar img {
    width: 35px;
    height: 35px;
  }

  .chat__footer {
    display: grid;
    grid-template-rows: 40px;
    grid-template-columns: 6fr minmax(135px, 2.2fr);
    grid-gap: 10px;
  }

  .footer__message-field {
    border: 1px solid #cccccc;
    border-radius: 3px;
    background: #ffffff;
    font-size: 15px;
    padding: 5px 10px;
  }

</style>

