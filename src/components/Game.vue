<template>
  <main @keyup.13="sendAnswer">
    <div class="animation_banner">
      <i class="fa fa-bell" aria-hidden="false"></i>
      <span class="text_animation_banner">
          {{ textBanner }}
      </span>
    </div>
    <div class="container">
      <article class="current-game">
          <section class="c-g__section_users_chat col-lg-12">
              <h2 class="text-center">Сведения об игре</h2>
              <section class="section_about_game">
                <div>
                  <h3>Подключенные пользователи и их результат:</h3>
                  <span class="text-secondary d-block">в реальном времени</span>
                  <div class="template_user text-danger">Evgen: 5 points</div>
                  <div class="template_user text-danger">Jenya: 0 points</div>
                </div>
                <div class="about_game__chat">
                  <div class="chat__message-box">
                    <h3 class="message-box__title text-center">Test0Chat</h3>
                    <div class="chat__template-message">
                      <div class="template-message__box-avatar rounded-circle">
                        <img class="rounded-circle" src="https://thesocietypages.org/socimages/files/2009/05/vimeo.jpg" alt="avatar-user">
                      </div>
                      <span class="template_message__message"><span class="message__user text-danger">EVgeny:</span> <span>Hellow may</span> </span>
                      <span class="teamplte-message__time text-secondary font-italic">23:47:51</span>
                    </div>
                  </div>
                  <form class="chat__footer" @submit.prevent="sendMessage">
                    <input class="footer__message-field" type="text" placeholder="Сообщение..." v-model="textMessage">
                    <button class="btn btn_def" type="submit">
                      Отправить
                      <i class="fa fa-paper-plane" aria-hidden="true"></i>
                    </button>
                  </form>
                </div>
              </section>
            <div class="control_btn_state_game">
              <button v-if="testingComplete" type="button" id="btn-start" class="btn btn-info btn-block" @click="startTesting">Start</button>
              <button v-else type="button" id="btn-end" class="btn btn-info btn-block" @click="finishGame">Прервать</button>
            </div>
            <div class="alert alert-primary" role="alert">
              Совет: Используйте клавиши клавиатуры,ввод значений осуществляется быстрей.
              Как только вы начнете играть - ваш фокус будет на вводимом поле,просто нажимайте цифры на клавиаутуре.
            </div>
            <hr>
          </section>
          <section class="col-lg-12">
            <div class="output_fields">
              <div class="output_fields__example">
                <time>Осталось времени: <span id="outputTime" v-if="!testingComplete"></span></time>
                <h1 class="display-4">- Пример -</h1>
              </div>
              <div v-if="testingComplete">
                <h4>Результат игры</h4>
                <h4>Правильных ответов: <span class="text-success">{{countCorrectAnswer}}</span></h4>
                <table class="table table-sm">
                  <thead>
                  <tr>
                    <th scope="col">Пример:</th>
                    <th scope="col">Ваш ответ:</th>
                    <th scope="col">Верный ответ:</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="result in listResultTest">
                    <td :class="result.userAnswer === result.Correct ? 'border_green' : 'border_red' ">{{result.Example}}</td>
                    <td :class="result.userAnswer === result.Correct ? 'border_green' : 'border_red' ">{{result.userAnswer}}</td>
                    <td :class="result.userAnswer === result.Correct ? 'border_green' : 'border_red' ">{{result.Correct}}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        <section class="c-g__section-game col-lg-12">
          <input v-model="dataCurrentTesting.userAnswer" class="field_answer" type="text" placeholder="Здесь будет отображаться ваш вводимый ответ" @input="processedAnswer">
          <div class="section-game__numbers-field">
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="1">1</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="2">2</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="3">3</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="4">4</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="5">5</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="6">6</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="7">7</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="8">8</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="9">9</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="0">0</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value="-">-</button>
            <button type="button" class="btn btn-outline-info" @click="addNumber($event.target.value)" value=".">.</button>
            <button type="button" class="btn btn-large btn-danger" @click="sendAnswer">Отправить результат</button>
            <button type="button" class="btn btn-large btn-danger" @click="removeAnswer">Очистить</button>
          </div>
        </section>
      </article>
    </div>
  </main>
</template>


<script>
  import * as firebase from 'firebase'

  export default  {
    name: 'StartGame',
    data () {
      return {
        socket: null,

        textBanner: 'Вы завершили испытание',
        textMessage: '',

        testingComplete: true,
        listResultTest: [],
        countCorrectAnswer: 0,
        timeCycle: '',
        timeCycle2: '',

        mathOperation: ['+', '-', '*', '/'],
        objectGameSettings: {
          rangeNumber: [10, 50],
          rangeNumber1: [1, 20]
        },
        dataCurrentTesting: {
          currentExample: '',
          correctAnswer: '',
          userAnswer: ''
        }
      }
    },
    created() {
//      if (!this.$store.state.participantGame) this.$router.push({name: 'Lobby'});
      this.socket = this.$store.state.socket;
      this.socket.addEventListener('message', this.getMessageFromServer);
      window.addEventListener('blur', this.lossFocusDuringGame)
    },
    beforeDestroy() {
      this.$store.commit('setParticipantGame', false);
    },
    methods: {
      sendMessage(e) {
        this.socket.send(JSON.stringify({
          type: 'send_message',
          data: {text: this.textMessage}
        }));
        this.textMessage = '';
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
      generateExample(min, max) {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
      },
      getNumber(range1, range2) {
        let number1 = this.generateExample(range1, range2);
        let number2 = this.generateExample(range1, range2);
        return [number1, number2]
      },
      processedAnswer() {
        this.dataCurrentTesting.userAnswer = this.dataCurrentTesting.userAnswer.replace(/[^-.0-9]/ig, '');
        if (parseInt(this.dataCurrentTesting.userAnswer, 10) === this.dataCurrentTesting.correctAnswer) this.sendAnswer();
      },
      startTesting() {
        this.listResultTest = [];
        this.countCorrectAnswer = 0;
        this.testingComplete = false;
        this.$store.commit('setStateGame', true);

        let timeForCurrentTesting = 10;
        let totalTestingTime = 10;

        document.querySelector('.field_answer').focus();
        this.updateCurrentExample();

        setTimeout(() => {
          document.querySelector('#outputTime').innerText = timeForCurrentTesting--;
        }, 0);
        this.timeCycle = setInterval(() => {
          if (document.querySelector('#outputTime')) document.querySelector('#outputTime').innerText = timeForCurrentTesting--;
        }, 1000);

        this.timeCycle2 = setTimeout(this.finishGame, totalTestingTime * 1000);
      },
      updateCurrentExample() {
        let indexMathOperation = this.generateExample(0, 3);
        let mathOperation = this.mathOperation[indexMathOperation];

        if (mathOperation === '+') {
          let [number1, number2] = this.getNumber(this.objectGameSettings.rangeNumber[0], this.objectGameSettings.rangeNumber[1]);
          this.dataCurrentTesting.correctAnswer = number1 + number2;
          this.dataCurrentTesting.currentExample = `${number1} + ${number2}`
        } else if (mathOperation === '-') {
          let [number1, number2] = this.getNumber(this.objectGameSettings.rangeNumber[0], this.objectGameSettings.rangeNumber[1]);
          this.dataCurrentTesting.correctAnswer = number1 - number2;
          this.dataCurrentTesting.currentExample = `${number1} - ${number2}`
        } else if (mathOperation === '*') {
          let [number1, number2] = this.getNumber(this.objectGameSettings.rangeNumber1[0], this.objectGameSettings.rangeNumber1[1]);
          this.dataCurrentTesting.correctAnswer = number1 * number2;
          this.dataCurrentTesting.currentExample = `${number1} * ${number2}`
        } else if (mathOperation === '/') {
          let [number1, number2] = this.getNumber(this.objectGameSettings.rangeNumber1[0], this.objectGameSettings.rangeNumber1[1]);

          while ((number1 / number2).toString().length > 2) {
            [number1, number2] = this.getNumber(this.objectGameSettings.rangeNumber[0], this.objectGameSettings.rangeNumber[1]);
          }

          this.dataCurrentTesting.correctAnswer = number1 / number2;
          this.dataCurrentTesting.currentExample = `${number1} / ${number2}`
        }

        if (document.querySelector('.display-4')) document.querySelector('.display-4').innerText = this.dataCurrentTesting.currentExample;
      },
      finishGame() {
        clearInterval(this.timeCycle);
        clearTimeout(this.timeCycle2);
        this.testingComplete = true;
        this.$store.commit('setStateGame', false);
        this.updateUsedFields();
        this.animationBannerEndGame();
      },
      updateUsedFields() {
        if (document.querySelector('#outputTime')) document.querySelector('#outputTime').innerText = '';
        if (document.querySelector('.display-4')) document.querySelector('.display-4').innerText = '- Пример -';
        this.dataCurrentTesting.userAnswer = '';
      },
      sendAnswer() {
        if (this.dataCurrentTesting.userAnswer.length === 0) return;
        if (!this.testingComplete) {
          if (parseInt(this.dataCurrentTesting.userAnswer, 10) === this.dataCurrentTesting.correctAnswer) this.countCorrectAnswer++;
          this.listResultTest.push({
            'Example': this.dataCurrentTesting.currentExample,
            'Correct': this.dataCurrentTesting.correctAnswer,
            'userAnswer': parseInt(this.dataCurrentTesting.userAnswer, 10)
          });
          this.updateCurrentExample();
        }
        this.dataCurrentTesting.userAnswer = '';
      },
      addNumber(value) {
        this.dataCurrentTesting.userAnswer += value;
        this.processedAnswer();
      },
      removeAnswer() {
        this.dataCurrentTesting.userAnswer = '';
      },
      lossFocusDuringGame() {
        if (!this.testingComplete) this.updateCurrentExample();
      },
      animationBannerEndGame() {
        setTimeout(() => {
          document.querySelector('.animation_banner').classList.add('animation_banner_start')
        }, 500);

        setTimeout(() => {
          document.querySelector('.animation_banner').classList.add('animation_banner_end')
        }, 3000);

        setTimeout(() => {
          document.querySelector('.animation-banner').classList.remove('animation_banner-start', 'animation_banner_end')
        }, 7000);
      }
    }
  }




</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .btn {
    cursor: pointer;
  }

  .border_green {
    border: 2px solid green;
  }

  .border_red {
    border: 2px solid crimson;
  }

  main {
    position: relative;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
  }


  .current-game {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 0.5fr minmax(1fr, 5fr) 1fr;
    grid-gap: 20px;

    min-height: 550px;

    border-radius: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border: 2px solid black;

    background: beige;
  }

  .section_about_game {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    grid-gap: 20px;

    margin-bottom: 10px;
  }

  .about_game__chat {
    position: inherit;
    display: grid;
    grid-template-rows: minmax(200px, 225px) 1fr;
    grid-template-columns: 1fr;
    grid-gap: 5px;

    padding: 7px;

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
    font-size: 1.6em;
    text-align: center;

    color:transparent;
    background: -webkit-linear-gradient(blue, green);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .chat__footer {
    display: grid;
    grid-template-rows: 35px;
    grid-template-columns: 6fr 2fr;
    grid-gap: 10px;

  }

  .footer__message-field {
    border: 1px solid #cccccc;
    border-radius: 3px;
    background: #ffffff;
    font-size: 15px;
    padding: 5px 10px;
  }


  .control_btn_state_game {
    display: flex;
    justify-content: center;

    width: 30%;
    margin-bottom: 10px;
    text-align: center;
  }

  .output_fields {
    display: grid;
    grid-template-columns: 2fr 3fr;

    text-align: center;
  }

  .output_fields__example {
    margin-right: 5px;
    border-right: 1px solid black;
  }

  .c-g__section-game {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 20px;

    border-radius: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border: 2px solid black;
  }

  .section-game__numbers-field {
    display: grid;
    grid-template-columns: 15fr 15fr 15fr;
    grid-template-rows: 35px 35px 35px;
    grid-gap: 5px;

    width: 65%;
    padding: 10px;

    border: 2px solid teal;
    border-radius: 5px;
  }

  .field_answer {
    width: 65%;
    margin-bottom: 20px;
    min-height: 40px;
    padding: 0 10px;

    border: 1px solid #cccccc;
    border-radius: 3px;
  }

  .field_answer:focus {
    -webkit-box-shadow: 0px 0px 5px #007eff;
    moz-box-shadow: 0px 0px 5px #007eff;
    box-shadow: 0px 0px 5px #007eff;
  }

</style>
