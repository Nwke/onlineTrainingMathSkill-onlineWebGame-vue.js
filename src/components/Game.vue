<template>
  <main @keyup.13="sendAnswer">
    <div class="animation_banner">
      <i class="fa fa-bell" aria-hidden="false"></i>
      <span class="text_animation_banner">
          {{ textBanner }}
      </span>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <h2 class="text-center">Сведения об игре</h2>
          <section class="section_about_game">
            <div class="connect_users">
              <h3>Подключенные пользователи:</h3>
              <div class="template_user">Evgen</div>
              <div class="template_user">Jenya</div>
            </div>
            <div class="current_result_users">
              <h3>Результаты игроков в реальном времени:</h3>
              <div class="template_user">Evgen: 5 point</div>
              <div class="template_user">Jenya: 0 point</div>
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
          <div class="output_fields">
            <div class="output_example_time">
              <time class="">Осталось времени: <span id="outputTime" v-if="!testingComplete"></span></time>
              <h1 class="display-4">- Пример -</h1>
            </div>
            <div v-if="testingComplete">
              <h4>Результат игры</h4>
               <h4>Правильных ответов: <span class="text_green">{{countCorrectAnswer}}</span></h4>
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
        </div>
        <div class="col-lg-12 section_game">
          <input v-model="dataCurrentTesting.userAnswer" class="field_answer" type="text" placeholder="Здесь будет отображаться ваш вводимый ответ" @input="processedAnswer">
          <div class="numbers_field">
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
        </div>
      </div>
    </div>
  </main>
</template>


<script>
  import * as firebase from 'firebase'

  export default  {
    name: 'StartGame',
    data () {
      return {
        textBanner: 'Вы завершили испытание',

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
      if (!this.$store.state.participantGame) this.$router.push({name: 'Lobby'});
      window.addEventListener('blur', this.lossFocusDuringGame)
    },
    beforeDestroy() {
      this.$store.commit('setParticipantGame', false);
    },
    methods: {
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

  .text_green {
    color: green;
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


  .row {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 2fr 1fr;
    grid-gap: 30px;

    min-height: 550px;

    border-radius: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border: 2px solid black;

    background: beige;
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

  .output_example_time {
    margin-right: 5px;
    border-right: 1px solid black;
  }

  .section_game {
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

  .numbers_field {
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

  .section_about_game {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    grid-gap: 20px;

    margin-bottom: 10px;
  }

</style>
