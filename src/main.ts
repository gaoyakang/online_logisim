import { createApp } from 'vue'
import './style.css'
import "@logicflow/core/dist/style/index.css";
import './assets/style/extension.css'
import App from './App.vue'
import { router } from './router';


const app = createApp(App);
app.use(router)
app.mount('#app')
