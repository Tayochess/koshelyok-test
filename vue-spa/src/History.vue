<template>
    <div class="history" id="history">
        <div class="history__list">
            <div class="history__item" v-for="(item, key) in showHistory" :key="key" >{{item}}</div>
        </div>
        <router-link
            active-class="is-active"
            class="button__link"
            :to="{ name: 'home' }">Search
        </router-link>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'history',
    props: ['type'],

    computed: {
        ...mapGetters({
            readHistory: 'getHistoryAll',
            readAdditions: 'getHistoryAdd',
            readDeletions: 'getHistoryDelete',
        }),

        showHistory() {
            if (this.type == 'add') {
                return this.readAdditions.map(el => this.stringifyHistory(el));
            }
            else if (this.type == 'delete') {
                return this.readDeletions.map(el => this.stringifyHistory(el));
            }
            else {
                return this.readHistory.map(el => this.stringifyHistory(el));
            }
        },
    },

    methods: {
        stringifyHistory(obj) {
            let d = new Date(obj.timestamp);
            return obj.id + ' ' + obj.name
                   + (obj.is_parent ? ' ' : ', subitem of ' + obj.parent_id + ', ')
                   + (obj.type == 'add' ? 'added to ' : 'deleted from ')
                   + 'Favourites on ' + d.getHours() + ':' + d.getMinutes() + ', ' + d.getDate() +'.' + d.getMonth() + '.' + d.getFullYear();
        },
    },
}
</script>

<style lang="scss">
    .history {
        padding: 10px;

        &__list {
            border-top: 1px solid #989898;
            margin-bottom: 30px;
        }

        &__item {
            padding: 10px;
            border-bottom: 1px solid #989898;
        }
    }

    .button__link {
        text-decoration: none;
        padding: 8px 15px;
        margin-right: 10px;
        background-color: #ff6535;
        color: #fff;
    }
</style>
