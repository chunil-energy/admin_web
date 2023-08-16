

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/ko';
import App from './App.vue'
import router from './router'
import "./assets/input.css";
dayjs.extend(utc)
dayjs.locale('ko')

const app = createApp(App)
app.config.globalProperties.$dayjs = dayjs

app.use(createPinia())
app.use(router)

app.mount('#app')
