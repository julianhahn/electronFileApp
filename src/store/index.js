import { createStore } from 'vuex'

const state = {
  testVersion: "",
  outputPath: "",
  inputfiles: [],
};

const mutations = {
  setTestVersion (state, test) {
    state.testVersion = test;
  },

  setOutputPath (state, output){
    state.outputPath = output;
  },

  setInputFiles (state, files){
    state.inputfiles = files;
  }
}

export default createStore({
  state,
  mutations
});
