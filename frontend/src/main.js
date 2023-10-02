import { createApp } from 'vue';
import App from './App.vue';
import './app.css';
import router from './router';
import VueMermaid from "./mermaid/index";

createApp(App)
    .use(router)
    .use(VueMermaid)
    .mount('#app');
