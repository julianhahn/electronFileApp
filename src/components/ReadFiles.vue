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
        <div v-for="file in storeFiles" :key="file" class="min-w-max px-4 py-1"> {{ file.name }}</div>
    </div>
    <!-- Start knopf -->
    <div class="self-center mx-auto mb-4">
        <button id="excelButton" class="bg-green-400 border text-gray-900 border-gray-800 rounded-3xl px-4 py-2 mt-2">Start</button>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { remote } from 'electron';

var dialog = remote.dialog;

export default {
    setup () {
        const store = useStore();
        const storeFiles = computed( () => store.state.inputfiles);
        var localFiles = ref([]);

        function getDataDialog(){
            dialog.showOpenDialog({
            title:"Daten der Brille",
            defaultPath: remote.app.getPath('desktop'),
            properties:['openFile', 'multiSelections'],
            filters: [{name: 'CSV', extensions: ['csv']}]
            })
            .then(function(result){
                localFiles.value=[];
                if(result !== undefined){
                    result.filePaths.forEach(entry => {
                        localFiles.value.push(
                            {
                                fullPath: entry,
                                name: entry.split(/(\\|\/)/).pop(),
                            }
                        );
                    });
                }
            });
        }

        function getDataDrop(e) {
            localFiles.value =[];
            console.log(e)
            var filelist = e.dataTransfer.localFiles;
            for (let index = 0; index < filelist.length; index++) {
                localFiles.value.push(filelist[index])
            }
        }
        return {
            localFiles,
            storeFiles,
            getDataDialog,
            getDataDrop,
            store
        }
    },

    watch: {
        localFiles(newFiles){
            this.store.commit('setInputFiles', newFiles)
        }

    }
}
</script>