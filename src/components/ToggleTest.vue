<template>
    <div class="bg-gray-800 w-10/12 h-64 mx-auto my-4 flex rounded-3xl shadow-2xl">
        <div class="w-max mx-auto self-center">
            <p>Bitte den Test auswählen:</p>
            <!-- Option A -->
            <div @click="mode = 'maze'"
                class="bg-green-400 text-gray-900 mt-4 rounded-2xl w-max px-3 py-1 mx-auto border-gray-800 border" 
                :class="mazeState">
                <p style="cursor: pointer;"> Maze Test </p>
            </div>
            <hr class=" mx-auto my-2 text-gray-700 w-10/12">
            <!-- Option B -->
            <div @click="mode = 'pit'"
            class="bg-green-400 text-gray-900 rounded-2xl w-max px-3 py-1 mx-auto border border-gray-800 "
            :class="pitState">
                <p style="cursor: pointer;"> PIT-VR Test </p>
            </div>
        </div>
    </div>
</template>

<script>
import { computed,ref } from 'vue';

export default {
    setup () {
        const mode = ref(null);
        
        const state = (_mode) => computed(() => {
            var selected  = mode.value === _mode;
            return {
                "ring-2": selected,
                "shadow-xl": selected,
                "opacity-50": !selected && mode.value !== null,
            }
        });

        const pitState = state('pit');
        const mazeState = state('maze');
        
        return {
            mode,
            mazeState,
            pitState
        };
    }
}
</script>