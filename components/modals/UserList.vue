<template>
    <div :class="modalMask" @click="close" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container overflow-auto">
            <div class="center" v-if="loading">
                <b-spinner label="Loading..."/>
            </div>
            <div class="center flex-wrap" style="overflow-y: auto" v-else-if="users != null">
                <div :style="{color: dark ? user.color.toDarkColor() : user.color}" class="m-2" v-for="user in users">
                    {{user.name}}
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

    @Component({components: {ModalBase}})
    export default class UserList extends mixins(ModalBase) {
        server: string = process.env.server as string;
        loading: boolean = true;
        users: { userId: string, name: string, color: string } | null = null;

        created() {
            axios.get(`${this.server}/api/account?hub=${this.hub}`)
                .then(response => {
                    this.users = response.data;
                    this.loading = false;
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
