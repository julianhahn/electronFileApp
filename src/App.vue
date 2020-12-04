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
                <div class="bg-gray-800 w-10/12 h-64 mx-auto my-4 flex rounded-3xl shadow-2xl">
                    <div class="w-max mx-auto self-center">
                        <p>Bitte den Test auswählen:</p>
                        <!-- Option A -->
                        <div id="mazeButton" class="bg-green-400 text-gray-900 mt-4 rounded-2xl w-max px-3 py-1 mx-auto border-gray-800 border">
                            <p id="mazeLabel" style="cursor: pointer;"> Maze Test </p>
                        </div>
                        <hr class=" mx-auto my-2 text-gray-700 w-10/12">
                        <!-- Option B -->
                        <div id="pitButton" class="bg-green-400 text-gray-900 rounded-2xl w-max px-3 py-1 mx-auto border border-gray-800 ">
                            <p id="pitLabel" style="cursor: pointer;"> PIT-VR Test </p>
                        </div>
                    </div>
                </div>

                <!-- Ausgabe Ort speichern -->
                <div class="mx-auto w-10/12 h-64 bg-gray-800 flex rounded-3xl px-4 shadow-2xl ">
                    <div class="w-max mx-auto self-center">
                        <p> Wo soll die Auswertung gespeichert werden?</p>
                        <button id="folderButton" class="bg-green-400  text-gray-900 border border-gray-800 rounded-3xl px-2 py-2 mt-2"> Ordner auswählen</button>
                        <p id="outputField" class="text-lg w-10/12 mx-auto pt-1"></p>
                    </div>
                </div>
            </div>
            <div id="zweites" class="mx-6 mb-8 lg:mb-0 h-auto flex bg-gray-700 rounded-lg mt-8 lg:mt-0 w-8/12 max-w-3xl text-2xl text-center">
                <div class="bg-gray-800 w-10/12 h-auto mx-auto p-4 my-4 flex flex-col rounded-3xl">
                    <div class="my-auto">
                        <!-- Daten einfügen und anzeigen lassen -->
                        <div class="mx-auto self-center">
                            <!-- Dialog -->
                            <button id="dataButton" class="bg-green-400 border text-gray-900 border-gray-800 rounded-3xl px-2 py-1 mt-2">Daten auswählen</button>
                        </div>
                        <!-- oder -->
                        <div class="w-full flex items-center my-4">
                            <hr class="border border-gray-900 flex-grow mx-4 mt-2" > oder <hr class="border border-gray-900 flex-grow mx-4 mt-2">
                        </div>
                        <!-- drag and drop field -->
                        <p class="text-center">Drag & Drop</p>
                        <div id="dropField" class="flex-grow h-64 text-gray-900 bg-gray-300 rounded-2xl mx-6 my-4 overflow-auto flex flex-col flex-nowrap place-items-start"></div>
                        <!-- Start knopf -->
                        <div class="self-center mx-auto mb-4">
                            <button id="excelButton" class="bg-green-400 border text-gray-900 border-gray-800 rounded-3xl px-4 py-2 mt-2">Start</button>
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

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style>

</style>
