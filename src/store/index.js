import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    modePage: '',
    socket: null,

    nameControlButton: 'Лобби',


    userData: {
      loginSuccess: false,
      login: 'Anonymous',
      raiting: 0
    },

    rightStartGame: false,
    participantGame: false,

    gameStarted: false
  },
  mutations: {
    setModePage(state, strValue) {
      state.modePage = strValue;
    },
    setUserData(state, obj) {
      state.userData = obj;
    },
    setConnectFromServer(state, objConnect) {
      state.socket = objConnect;
    },
    setStateGame(state, boolValue) {
      state.gameStarted = boolValue;
    },
    setParticipantGame(state, boolValue) {
      state.participantGame = boolValue;
    },
    setNameControlButton(state, strValue) {
      state.nameControlButton = strValue;
    }
  }
})
