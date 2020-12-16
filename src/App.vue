<template>
<!DOCTYPE html>
<div class="flex flex-col h-screen bg-gray-700 text-white">
   <Header/>
    <!-- Content -->
    <div class="flex-1 overflow-y-auto">
        <div class="flex flex-col lg:flex-row justify-center items-center lg:h-full">
        <!-- <div class="grid grid-cols-1 lg:grid-cols-2 h-full place-items-center"> -->
            <div id="erstes" class="mx-6 h-auto bg-gray-700 rounded-lg mt-8 lg:mt-0 py-4 w-8/12 max-w-3xl text-2xl text-center">
                <!-- maze oder pit vr -->
                <ToggleTest/>
                <!-- Ausgabe Ort speichern -->
                <div class="mx-auto w-10/12 h-64 bg-gray-800 flex rounded-3xl px-4 shadow-2xl ">
                    <div class="w-max mx-auto self-center">
                        <p> Wo soll die Auswertung gespeichert werden?</p>
                        <button @click="chooseOutputFolder" class="bg-green-400  text-gray-900 border border-gray-800 rounded-3xl px-2 py-2 mt-2"> Ordner auswählen</button>
                        <p class="text-lg w-10/12 mx-auto pt-1">{{filepath}}</p>
                    </div>
                </div>
            </div>

            <div id="zweites" class="mx-6 mb-8 lg:mb-0 h-auto flex bg-gray-700 rounded-lg mt-8 lg:mt-0 w-8/12 max-w-3xl text-2xl text-center">
                <div class="bg-gray-800 w-10/12 h-auto mx-auto p-4 my-4 flex flex-col rounded-3xl">
                    <div class="my-auto">
                        <!-- Daten einfügen und anzeigen lassen -->
                        <ReadFiles/>
                        <!-- Start knopf -->
                        <div class="self-center mx-auto mb-4">
                            <button @click="convertData" class="bg-green-400 border text-gray-900 border-gray-800 rounded-3xl px-4 py-2 mt-2">Start</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import ToggleTest from '@/components/ToggleTest.vue';
import ReadFiles from './components/ReadFiles.vue';

import { ref, computed } from 'vue'
import { app, remote } from 'electron'
import { useStore } from 'vuex';
import fs from 'fs';
// import dayjs from 'dayjs';
import path from 'path';
import isDev from 'electron-is-dev'

let dialog = remote.dialog;

export default {
  name: 'App',
  components: {
    Header,
    ToggleTest,
    ReadFiles,
  },

  setup() {
    const store = useStore()
    const filepath = ref("");

    const canStart = computed(() => {
      return store.state.testVersion && store.state.outputPath && (store.state.inputfiles && store.state.inputfiles.lenght > 0) 
    })

    function convertData(){
      // wenn store.mode == pit dann als Kopiere eine kopie eine Kopie des Ergebnisses in dem Outputfolder
      if(store.state.testVersion === "pit"){
        let outputPath = path.normalize(store.state.outputPath + "/Auswertungssheet_PIT_.xlsx")
        let inputPath = "";
        if(isDev){
          inputPath = path.normalize(path.join(remote.app.getAppPath(),"../extraResources/Auswertungssheet_PIT-VR.xlsx"));
          console.log("in development " + inputPath)
        }else {
          inputPath = path.normalize(path.join(app.getAppPath(),"../extraResources/Auswertungssheet_PIT-VR.xlsx"));
        }
        //gehe in die erste Datei rein

        fs.copyFileSync(inputPath, outputPath);
      }
    }

    function chooseOutputFolder (){
      dialog.showOpenDialog({
            title:"Speicherort der Auswertung",
            defaultPath: remote.app.getPath('desktop'),
            properties:['openDirectory']
        })
        .then(function(result){
            if( result !== undefined){
                filepath.value = result.filePaths[0]
            }
        });
    }

    return {
      filepath, 
      chooseOutputFolder,
      convertData,
      store,
      canStart
    }
  },

  watch:{
    filepath(newVal){
      this.store.commit('setOutputPath', newVal)
    }
  }
}
</script>

<style>

</style>
