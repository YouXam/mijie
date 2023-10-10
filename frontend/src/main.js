import { createApp } from 'vue';
import App from './App.vue';
import './app.css';
import router from './router';
import VueMermaid from "@/tools/mermaid/index";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
    faRankingStar, faCodeMerge, faChartBar, faUser, faGear, faBarsStaggered, faRightFromBracket,
    faFileArrowDown, faCircleInfo, faCircleCheck, faTriangleExclamation, faCircleXmark,
    faAnglesDown, faArrowsRotate, faXmark, faAddressBook, faNoteSticky, faTrash, faChalkboard
} from '@fortawesome/free-solid-svg-icons';

[
    faRankingStar,
    faCodeMerge,
    faChartBar,
    faUser,
    faGear,
    faBarsStaggered,
    faRightFromBracket,
    faFileArrowDown,
    faCircleInfo,
    faCircleCheck,
    faTriangleExclamation,
    faCircleXmark,
    faAnglesDown,
    faArrowsRotate,
    faXmark,
    faAddressBook,
    faNoteSticky,
    faTrash,
    faChalkboard
].forEach(icon => library.add(icon));

createApp(App)
    .use(router)
    .use(VueMermaid)
    .component('font-awesome-icon', FontAwesomeIcon)
    .directive('auto-expand', {
        beforeMount(el) {
            el.style.height = 'auto';
            el.style.overflowY = 'hidden';
            el.addEventListener('input', function () {
                el.style.height = 'auto';
                el.style.height = (el.scrollHeight) + 'px';
            });
        }
    })
    .mount('#app');
