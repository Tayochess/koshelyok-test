<template>
    <div id="searchlist">
        <div class="table">
            <div class="table__column">
                <div class="table__heading">Search</div>
                <div class="table__input">
                    <input class="table__field" type="text" name="search" :value="this.query" @input="updateInput">
                    <button class="table__button" type="button" name="button" @click="reverse()">Reverse</button>
                </div>
                <virtual-list style="max-height: 360px; overflow-y: auto;"
                    :data-key="'uid'"
                    :data-sources="sortData"
                    :data-component="listComponent"
                    :extra-props="{
                            'togglefavs': favsToggle,
                        }"
                />
            </div>
            <div class="table__column">
                <div class="table__heading table__heading-second">Favourites</div>
                <virtual-list style="height: 360px; overflow-y: auto;"
                    :data-key="'uid'"
                    :data-sources="getFavs"
                    :data-component="listComponent"
                    :extra-props="{
                            'isfavslist': true,
                            'togglefavs': favsToggle,
                        }"
                />
            </div>
        </div>
        <div class="buttons">
            <router-link
                active-class="is-active"
                class="buttons__link"
                :to="{ name: 'history' , params: { type: 'all' } }">History
            </router-link>
            <router-link
                active-class="is-active"
                class="buttons__link"
                :to="{ name: 'history', params: { type: 'add' } }">Additions
            </router-link>
            <router-link
                active-class="is-active"
                class="buttons__link"
                :to="{ name: 'history', params: { type: 'delete' } }">Deletions
            </router-link>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import VirtualList from 'vue-virtual-scroll-list'
import ListItem from './ListItem.vue'
import { mapMutations } from 'vuex';

// import json from './data.json';

export default {
    components: { 'virtual-list': VirtualList },

    data() {
        return {
            list: null,
            query: '',
            reversed: false,
            api: 'https://unicornyar.com/useruploads/data2.json',
            listComponent: ListItem,
        }
    },

    computed: {
        excludeFavs() {
            return this.list ? this.list.filter(item => !item.is_fav) : [];
        },

        getFavs() {
            return this.list ? this.list.filter(item => item.is_fav || item.has_favs) : [];
        },

        searchData() {
            let q = new RegExp(this.query, "g");
            return this.excludeFavs.filter((item) => {
                let l = 0;
                if (item.data.items) {
                    item.data.items = item.data.items.filter((el) => {
                        el.len = (el.name.toLowerCase().match(q) || []).length;
                        l += el.len;
                        if (el.len > 0) {
                            return el;
                        }
                    });
                }
                item.len = (item.data.name.toLowerCase().match(q) || []).length;
                item.len += l;
                if (item.len > 0) {
                    return item;
                }
            });
        },

        sortData() {
            if (!this.query) {
                return this.excludeFavs;
            }
            if (this.reversed) {
                return this.searchData.map((item) => {
                    if (item.data.items) {
                        item.data.items = item.data.items.sort((j1, j2) => j1.len - j2.len);
                    }
                    return item;
                }).sort((i1, i2) => i1.len - i2.len);
            }
            else {
                return this.searchData.map((item) => {
                    if (item.data.items) {
                        item.data.items = item.data.items.sort((j1, j2) => j2.len - j1.len);
                    }
                    return item;
                }).sort((i1, i2) => i2.len - i1.len);
            }
        },
    },

    created() {
        this.getData();
    },

    methods: {
        mapSubitems(item) {
            if (item.items) {
                let copy = item;
                copy.items = copy.items.map((el, index) => {
                    return {uid: index, len: 0, is_fav: false, ...el};
                })
                return copy;
            }
            return item;
        },

        getData() {
            // this.list = json.map((item, index) => {
            //     return {
            //         uid: index,
            //         is_fav: false,
            //         has_favs: false,
            //         len: 0,
            //         data: this.mapSubitems(item)
            //     };
            // });
            axios.get(this.api)
            .then(response => {
                this.list = response.data.map((item, index) => {
                    return  {
                                key: index,
                                len: 0,
                                data: item
                            };
                });
            })
            .catch(error => {
                console.log('Data loading failed!');
                console.log(error);
            })
        },

        updateInput() {
            this.query = event.target.value;
        },

        reverse() {
            this.reversed = !this.reversed;
        },

        favsToggle(el) {
            let index = this.list.findIndex((item) => item.uid == el.parent_id);
            if (index != -1) {
                if (el.is_parent) {
                    let toggle = !this.list[index].is_fav;
                    this.list[index].is_fav = toggle;
                    if (this.list[index].data.items) {
                        this.list[index].data.items.forEach((subitem) => {
                            subitem.is_fav = toggle;
                        });
                    }
                    this.addToHistory(this.list[index].data.id, this.list[index].data.name, toggle, el.is_parent, 0);
                }
                else if (this.list[index].data.items) {
                    let index2 = this.list[index].data.items.findIndex((item) => item.uid == el.id);
                    if (index2 != -1) {
                        let toggle = !this.list[index].data.items[index2].is_fav;
                        this.list[index].data.items[index2].is_fav = toggle;
                        if (toggle) {
                            this.list[index].has_favs = true;
                        }
                        else {
                            this.list[index].has_favs = this.list[index].data.items.reduce((a, b) => a || b.is_fav, false);
                        }
                        this.addToHistory(this.list[index].data.items[index2].id, this.list[index].data.items[index2].name, toggle, el.is_parent, this.list[index].data.id);
                    }

                }
            }
        },

        addToHistory(id, name, val, is_parent, parent_id) {
            this.writeHistory({
                id: id,
                name: name,
                type: val ? 'add' : 'delete',
                is_parent: is_parent,
                parent_id: is_parent ? -1 : parent_id,
                timestamp: Date.now(),
            });
        },

        ...mapMutations({
            writeHistory: 'ADD_TO_HISTORY',
        }),
    }
}
</script>

<style lang="scss">
.table {
    padding: 10px;
    display: flex;

    &__column {
        flex-basis: 50%;
    }

    &__column:first-child {
        margin-right: 30px;
    }

    &__heading {
        font-size: 1.6em;
        margin-bottom: 10px;

        &-second {
            margin-bottom: 45px;
        }
    }

    &__input {
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    &__field {
        padding: 8px 3px;
        margin-right: 10px;
        border: 1px solid #989898;
        border-radius: 0;
        flex-grow: 1;
    }

    &__button {
        border: none;
        background-color: #616161;
        color: #fff;
        padding: 8px 15px;
        font-size: inherit;
    }
}

.buttons {
    display: flex;
    padding: 10px;

    &__link {
        text-decoration: none;
        padding: 8px 15px;
        margin-right: 10px;
        background-color: #ff6535;
        color: #fff;
    }
}
</style>
