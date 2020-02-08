<template>
    <div :style="{'background-color': dark ? 'black' : 'white'}" class="modal-mask" style="display: table">
        <div class="modal-wrapper">
            <b-spinner label="Loading..."/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins} from 'nuxt-property-decorator';
    import ModalBase from '@/components/scaffolding/ModalBase';

    @Component({components: {ModalBase}})
    export default class Loading extends mixins(ModalBase) {
    }
</script>

<style scoped>
    @import "@/assets/modal.css";

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
    }
</style>
