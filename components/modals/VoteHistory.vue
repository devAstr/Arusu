<template>
    <div :class="modalMask" @click="close" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container overflow-auto">
            <div class="mb-2">這個還在做</div>
            <div class="center" v-if="loading">
                <b-spinner label="Loading..."/>
            </div>
            <div class="center flex-wrap" style="overflow-y: auto" v-else>
                <div :style="{color: dark ? vote.color.toDarkColor() : vote.color}" class="m-2" v-for="vote in votes">
                    {{vote.title}}
                </div>
            </div>
            <button @click="$emit('close')" class="btn btn-outline-secondary mt-3" type="button">
                關閉
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins} from 'nuxt-property-decorator';
    import ModalBase from '@/components/scaffolding/ModalBase';
    import axios from 'axios';
    import Vote from '@/types/Vote';

    @Component({components: {ModalBase}})
    export default class VoteHistory extends mixins(ModalBase) {
        server: string = process.env.server as string;
        loading: boolean = true;
        votes: Vote[] = [];

        created() {
            axios.get(`${this.server}/api/vote?hub=${this.hub}`)
                .then(response => {
                    this.votes = response.data;
                })
                .catch(e => {
                    console.warn(e);
                    this.$emit('close');
                });
        }
    }
</script>

<style scoped>
    @import '@/assets/general.css';
    @import '@/assets/general.css';
    @import '@/assets/modal.css';
</style>