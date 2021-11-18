import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import App from './App.vue'
import History from './History.vue'
import SearchList from './SearchList.vue'

Vue.use(Vuex)
Vue.use(Router)

const store = new Vuex.Store({
    state: {
        history: [],
    },
    mutations: {
        ADD_TO_HISTORY(state, data) {
            state.history.push(data);
        },
    },
    getters: {
        getHistoryAll: state => {
            return state.history;
        },
        getHistoryAdd: state => {
            return state.history.filter(item => item.type == 'add');
        },
        getHistoryDelete: state => {
            return state.history.filter(item => item.type == 'delete');
        },
    },
})

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name:'home',
            component: SearchList,
        },
        {
            path: '/history/:type',
            name:'history',
            component: History,
            props: true,
        },
    ]
})

new Vue({
    el: '#app',
    render: h => h(App),
    store: store,
    router: router,
})
