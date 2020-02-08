<template>
    <div :class="modalMask" @click="close" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container">
            <div>
                送出檢舉
            </div>
            <h5 :style="{color : media.color}" class="my-3">{{ media.name }}</h5>

            <div class="mt-4 center">
                <button @click="send" class="btn btn-primary mx-2" type="button">確定</button>
                <button @click="$emit('close')" class="btn btn-outline-secondary mx-2" type="button">
                    取消
                </button>
            </div>
        </div>
    </div>

</template>

<script lang="ts">
    import {Component, mixins, Prop} from 'nuxt-property-decorator';
    import ModalBase from '@/components/scaffolding/ModalBase';
    import Media from '@/models/Media';
    import {ReportRequest} from '@/types/Requests';
    import axios from 'axios';

    @Component({components: {ModalBase}})
    export default class Report extends mixins(ModalBase) {
        @Prop({default: null}) media!: Media;

        async send() {
            if (this.media == null) {
                return;
            }

            axios.post(`${process.env.server}/api/report`,
                new ReportRequest(this.media.userId, this.media.uri),
                {
                    headers: new Headers({
                        'Content-Type': 'text/json'
                    })
                }
            ).then(_ => {
                this.$emit('close');
            }).catch(error => {
                console.log(error);
                this.$emit('close');
            });
        }
    }
</script>

<style scoped>
    @import '@/assets/general.css';
    @import '@/assets/modal.css';
</style>
