<template>
    <div :class="modalMask" @click="$emit('close')" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container" style="max-height: none">
            <img :src="url" class="image">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins, Prop} from 'nuxt-property-decorator';
    import ModalBase from '@/components/scaffolding/ModalBase';

    @Component({components: {ModalBase}})
    export default class ImageViewer extends mixins(ModalBase) {
        @Prop({default: null}) url!: string | null;

        mounted() {
            if (IsNullOrWhiteSpace(this.url)) {
                this.$emit('close');
            }
        }
    }
</script>

<style scoped>
    @import '@/assets/modal.css';

    .image {
        max-width: 100%;
        max-height: 90vh;
        margin: auto;
    }
</style>
