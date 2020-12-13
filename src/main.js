import { createApp } from 'vue'
import store from './store/index';

import App from './App.vue'
import './assets/tailwind.css'

createApp(App).use(store).mount('#app')
