<template>
    <div :class="lineClass">
        <div>{{data.name}}</div>
        <button v-if="hasbutton" :class="buttonClass" type="button" name="button" @click="favsToggle()"></button>
    </div>
</template>

<script>
export default {
    name: 'item-line',
    props: {
        data: {
            type: Object,
            default: () => {},
        },
        parent: {
            type: Boolean,
            default: false,
        },
        togglefavs: {
            type: Function,
            default: () => {},
        },
        hasbutton: {
            type: Boolean,
            default: false,
        },
        isfavslist: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        lineClass() {
            return this.parent ? 'list__line list__line-parent' : 'list__line';
        },

        buttonClass() {
            return this.isfavslist ? 'line__button line__button-fav' : 'line__button';
        },
    },

    methods: {
        favsToggle() {
            let el = {
                is_parent: this.parent,
                id: this.data.uid
            };
            this.togglefavs(el);
        }
    }
}
</script>

<style lang="scss">
    .list__line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        padding-left: 10px;

        &-parent {
            background-color: #dedede;
            padding-left: 5px;
        }
    }

    .line__button {
        position: relative;
        border: none;
        border-radius: 50%;
        padding: 0;
        width: 20px;
        height: 20px;
        background-color: #616161;

        &::after {
            content: '';
            position: absolute;
            top: 6px;
            left: 5px;
            width: 6px;
            height: 6px;
            border-top: 2px solid #fff;
            border-right: 2px solid #fff;
            transform: rotate(45deg);
        }

        &-fav::after {
            left: 7px;
            transform: rotate(-135deg);
        }
    }
</style>
