import { createApp } from 'vue';
import App from './App.vue';
import './app.css';
import router from './router';
import VueMermaid from "@/tools/mermaid/index";

createApp(App)
    .use(router)
    .use(VueMermaid)
    .directive('auto-expand', {
        beforeMount(el) {
            el.addEventListener('input', function () {
                el.style.height = 'auto';
                el.style.height = (el.scrollHeight) + 'px';
                el.style.overflowY = 'hidden';
            });
        }
    })
    .mount('#app');
