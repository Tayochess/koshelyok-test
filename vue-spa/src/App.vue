<template>
    <div id="app">
        <div class="input__container">
            <input type="text" name="search" :value="this.query" @input="updateInput">
        </div>
        <div class="table">
            <div class="table__column">
                <div v-for="item in showData" class="table__line">
                    <span>{{item.data.title}}</span>
                    <button type="button" name="button" @click="addToFavs(item)">+</button>
                </div>
            </div>
            <div class="table__column">
                <div v-for="item in getFavs" class="table__line">
                    <span>{{item.data.title}}</span>
                    <button type="button" name="button" @click="removeFromFavs(item)">-</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    list: null,

    data () {
        return {
            query: '',
            favs: [],
            api: 'https://jsonplaceholder.typicode.com/posts/',
        }
    },

    computed: {
        excludeFavs() {
            return this.list ? this.list.filter(item => !this.favs.includes(item.key)) : [];
        },

        getFavs() {
            return this.list ? this.list.filter(item => this.favs.includes(item.key)) : [];
        },

        showData() {
            if (this.query) {
                let q = new RegExp(this.query, "g");
                return this.excludeFavs.filter((item) => {
                    item.length = (item.data.title.toLowerCase().match(q) || []).length;
                    if (item.length > 0) {
                        return item;
                    }
                }).sort((i1, i2) => i2.length - i1.length)
            }
            else {
                return this.excludeFavs;
            }
        }
    },

    created() {
        this.getData();
    },

    methods: {
        getData() {
            axios.get(this.api)
            .then(response => {
                this.list = response.data.map((item, index) => {
                    return  {
                                key: index,
                                length: 0,
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

        addToFavs(item) {
            this.favs.push(item.key);
        },

        removeFromFavs(item) {
            let index = this.favs.indexOf(item.key);
            if(index != -1) {
               this.favs.splice(index, 1);
            }
        }
    }
}
</script>

<style lang="scss">
.table {
    display: flex;
}
</style>
