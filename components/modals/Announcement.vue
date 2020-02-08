<template>
    <div :class="modalMask" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container">
            <div class="m-2">
                <div class="title m-2 ml-3">Pneuma</div>
                <h4>
                    <slot name="title"/>
                </h4>
            </div>
            <h5 class="my-3 flex-grow-1">
                <slot/>
            </h5>
            <button @click="$emit('close')" class="btn btn-outline-secondary m-2" type="button">
                關閉
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins} from 'nuxt-property-decorator';
    import ModalBase from '@/components/scaffolding/ModalBase';

    @Component({components: {ModalBase}})
    export default class Announcement extends mixins(ModalBase) {
    }
</script>

<style scoped>
    @import '@/assets/modal.css';

    .title {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
