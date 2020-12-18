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
        <div 
         @dragover.prevent="highlighted=true"
         @dragleave.prevent="highlighted=false"
         @drop.prevent="getDataDrop($event)"
         class="flex-grow h-64 text-gray-900 bg-gray-300 rounded-2xl mx-6 my-4 overflow-auto flex flex-col flex-nowrap place-items-start"
         :class="{'bg-green-400': highlighted}">
        <div v-for="file in storeFiles" :key="file" class="min-w-max px-4 py-1"> {{ file.name }}</div>
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
        var highlighted = ref(false);
        
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
            this.highlighted = false;
            localFiles.value =[];
            var filelist = e.dataTransfer.files;
            for (let index = 0; index < filelist.length; index++) {
                localFiles.value.push({
                    fullPath: filelist[index].path,
                    name: filelist[index].name
                })
            }
        }
        return {
            localFiles,
            storeFiles,
            getDataDialog,
            getDataDrop,
            store,
            highlighted
        }
    },

    watch: {
        localFiles(newFiles){
            this.store.commit('setInputFiles', newFiles)
        }

    }
}
</script>