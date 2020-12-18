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
                            <button :disabled='!canStart'  @click="convertData"
                            class="bg-green-400 border text-gray-900 border-gray-800 rounded-3xl px-4 py-2 mt-2"
                            :class="{'opacity-50': !canStart}">Start</button>
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
import { remote } from 'electron'
import { useStore } from 'vuex';
import fs from 'fs';
import path from 'path';
import isDev from 'electron-is-dev'
import csv from 'csv-parser'
import XlsxTemplate from 'xlsx-template';
import { promisify } from 'util';

let dialog = remote.dialog;
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const renameFileAsync = promisify(fs.rename);

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
      return store.state.testVersion && store.state.outputPath && (store.state.inputfiles && Object.keys(store.state.inputfiles).length > 0) 
    })

    async function convertData(){
      // wenn store.mode == pit dann als Kopiere eine kopie eine Kopie des Ergebnisses in dem Outputfolder
      try{
        var files = store.state.inputfiles;
        if(store.state.testVersion === "pit"){
          let outputPath = path.normalize(store.state.outputPath + "/Auswertungssheet.xlsx")
          let inputPath = "";
          if(isDev){
            inputPath = path.normalize(path.join(remote.app.getAppPath(),"../extraResources/Auswertungssheet.xlsx"));
          }else {
            inputPath = path.normalize(path.join(remote.app.getAppPath(),"../extraResources/Auswertungssheet.xlsx"));
          }
          const templateFile = await readFileAsync(inputPath);
          var template = new XlsxTemplate(templateFile);

          let sheetNames = ["Training","GespiegeltesC", "Stufe", "V", "U", "O", "Deich", "ZickZack", "n"];
          let sheetsTotal = sheetNames.length;
          for (const file of files){
            const sheetName = file.fullPath.match(/^.*?_(?<name>[a-z\s]+).csv$/im).groups.name.replace(" ", "");
            await setDataInSheet(template, file.fullPath, sheetName)
            sheetNames = sheetNames.filter((_sheetName)=> _sheetName !== sheetName)
          }
          var result = template.generate();
          await writeFileAsync(outputPath, result, "binary");
          const csvData = await getCSVfromFile(files[0].fullPath)
          const patientID = csvData[0]["PatientenID"].replace(/\s+/g,"_");
          const newOutputPath = outputPath.replace("Auswertungssheet", "Auswertungssheet_"+patientID)
          await renameFileAsync(outputPath, newOutputPath);
          dialog.showMessageBox({title: "Success", message: `Es wurden ${sheetsTotal - sheetNames.length} von ${sheetsTotal} Pfaden geschrieben.`})
        }
      }
      catch(e){
        console.log(e.stack)
      }
    }

    function parseGermanFloat(str){
      return parseFloat(str.replace(",", "."));
    }

    async function setDataInSheet(template, csvFilepath, sheetName){
      var data = await getCSVfromFile(csvFilepath);
      const [rowOne, rowTwo, rowThree] = data;
      const endPoint = { x: data[data.length-2]['playerPosition.X in Metern vom Ursprung'], z: data[data.length-2]['playerPosition.Z in Metern vom Ursprung']};
      var values = {
        ax: parseGermanFloat(rowOne['ZielPositionen.X']),
        ay: parseGermanFloat(rowOne['ZielPositionen.Z']),
        bx: parseGermanFloat(rowTwo['ZielPositionen.X']),
        by: parseGermanFloat(rowTwo['ZielPositionen.Z']),
        cx: parseGermanFloat(rowThree['ZielPositionen.X']),
        cy: parseGermanFloat(rowThree['ZielPositionen.Z']),
        confirmx: parseGermanFloat(endPoint.x),
        confirmy: parseGermanFloat(endPoint.z),
        };
      template.substitute(sheetName, values);
    }

    function getCSVfromFile(inputFilePath){
      const results=[];
      return new Promise( resolve => {
        fs.createReadStream(inputFilePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results)
        });
      });
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
