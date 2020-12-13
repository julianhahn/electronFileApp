<template>
    <div class="mx-auto self-center">
    <!-- Dialog -->
    <button @click="getDataDialog" class="bg-green-400 border text-gray-900 border-gray-800 rounded-3xl px-2 py-1 mt-2">Daten auswählen</button>
    </div>
    <!-- oder -->
    <div class="w-full flex items-center my-4">
        <hr class="border border-gray-900 flex-grow mx-4 mt-2" > oder <hr class="border border-gray-900 flex-grow mx-4 mt-2">
    </div>
    <!-- drag and drop field -->
    <p class="text-center">Drag & Drop</p>
    <div @dragover.prevent @dragenter.prevent @drop.prevent="getDataDrop($event)" class="flex-grow h-64 text-gray-900 bg-gray-300 rounded-2xl mx-6 my-4 overflow-auto flex flex-col flex-nowrap place-items-start">
        <div v-for="file in files" :key="file" class="min-w-max px-4 py-1"> {{ file.name }}</div>
    </div>
    <!-- Start knopf -->
    <div class="self-center mx-auto mb-4">
        <button id="excelButton" class="bg-green-400 border text-gray-900 border-gray-800 rounded-3xl px-4 py-2 mt-2">Start</button>
    </div>
</template>

<script>
import { ref } from 'vue';
import { remote } from 'electron';

var dialog = remote.dialog;

export default {
    setup () {
        var files = ref([]);

        function getDataDialog(){
            dialog.showOpenDialog({
            title:"Daten der Brille",
            defaultPath: remote.app.getPath('desktop'),
            properties:['openFile', 'multiSelections'],
            filters: [{name: 'CSV', extensions: ['csv']}]
            })
            .then(function(result){
                files.value=[];
                if(result !== undefined){
                    result.filePaths.forEach(entry => {
                        files.value.push(
                            {
                                fullPath: entry,
                                name: entry.split(/(\\|\/)/).pop(),
                            }
                        );
                    });
                }
                console.log(files.value)
            });
        }

        function getDataDrop(e) {
            files.value =[];
            console.log(e)
            var filelist = e.dataTransfer.files;
            for (let index = 0; index < filelist.length; index++) {
                files.value.push(filelist[index])
            }
            console.log(filelist);
        }
        return {
            files,
            getDataDialog,
            getDataDrop
        }
    }
}
</script>