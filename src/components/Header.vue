<template>
   <header style="-webkit-app-region: drag" class="flex h-12 w-full px-4 shadow-lg bg-gray-900">
        <div class="text-2xl my-auto">UKSH VR Auswertung</div>
        <button v-on:click="minimize" class="ml-auto justify-end mr-4" style="-webkit-app-region: no-drag">
            <svg class="w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6" />
            </svg>
        </button>
        <button v-on:click="maximize" class="mr-4 justify-end" style="-webkit-app-region: no-drag">
            <svg class="w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
        </button>
        <button v-on:click="close" class="mr-4 justify-end" style="-webkit-app-region: no-drag">
            <svg class="w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
    </header>
</template>

<script>
import { remote } from 'electron';

export default {
setup(){
    let window = remote.getCurrentWindow();
    
    function close(){
        window.close();
    }
    function minimize(){
        window.minimize();
    }

    function maximize(){
        window.maximize();
    }

    return {
        close,
        minimize,
        maximize
    }
}
}
</script>

<style>

</style>