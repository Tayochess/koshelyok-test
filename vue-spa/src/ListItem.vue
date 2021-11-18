<template>
    <div class="list__item">
        <item-line
            :data="current"
            :parent="true"
            :togglefavs="favsToggle"
            :hasbutton="hasButton"
            :isfavslist="isfavslist"
        />
        <div v-if="subitems">
            <item-line v-for="(subitem, s_ind) in subitems"
                :key="s_ind"
                :data="subitem"
                :togglefavs="favsToggle"
                :hasbutton="subitemHasButton"
                :isfavslist="isfavslist"
            />
        </div>
    </div>
</template>

<script>
import ItemLine from './ItemLine.vue'

export default {
    name: 'list-item',
    components: { 'item-line': ItemLine },

    props: {
        index: {
            type: Number
        },
        source: {
            type: Object,
            default () {
                return {}
            }
        },
        isfavslist: {
            type: Boolean,
            default: false,
        },
        togglefavs: {
            type: Function,
        },
    },

    data() {
        return {
            current: {
                uid: this.source.uid,
                is_fav: this.source.is_fav,
                has_favs: this.source.has_favs,
                name: this.source.data.name,
            }
        }
    },

    computed: {
        hasButton() {
            return !this.isfavslist || this.isfavslist && this.source.is_fav;
        },

        subitemHasButton() {
            return !this.source.is_fav;
        },

        subitems() {
            if (this.isfavslist) {
                return this.source.data.items ? this.source.data.items.filter(item => item.is_fav) : [];
            }
            else {
                return this.source.data.items ? this.source.data.items.filter(item => !item.is_fav) : [];
            }
        }
    },

    methods: {
        favsToggle(el) {
            el = {parent_id: this.current.uid, ...el};
            this.togglefavs(el);
        }
    }
}
</script>
