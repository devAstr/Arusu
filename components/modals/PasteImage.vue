<template>
    <div :class="modalMask" @click="close" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container" style="max-height: none">
            <button @click="login" class="btn btn-primary" style="margin: auto" v-if="x > 0 && imgurAccess == null">
                登入 Imgur 以繼續
            </button>
            <div class="d-flex flex-column justify-content-around" v-else>
                <img :src="src" class="image" v-if="!uploading">
                <div :class="{invisible: uploading}" class="mt-4 d-flex justify-content-center">
                    <button @click="upload" class="btn btn-primary mx-2" type="button">上傳</button>
                    <button @click="$emit('close')" class="btn btn-outline-secondary mx-2" type="button">
                        取消
                    </button>
                </div>
            </div>
            <div class="modal-mask d-flex" v-if="uploading">
                <b-spinner :class="{'text-light': dark}" label="Uploading..." style="margin: auto;"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins, Prop} from 'nuxt-property-decorator';
    import ModalBase from '@/components/scaffolding/ModalBase';
    import axios from 'axios';
    import * as Cookies from 'js-cookie';
    import {Cookie} from '@/types/Types';

    @Component({components: {ModalBase}})
    export default class PasteImage extends mixins(ModalBase) {
        @Prop({default: null}) blob!: File;
        src: string = '';
        imgurAccess: string | undefined = undefined;
        uploading: boolean = false;
        x: number = 1;

        created() {
            this.imgurAccess = Cookies.get(Cookie.Imgur);
            let reader = new FileReader();

            reader.onload = () => {
                this.src = reader.result as string;
            };

            reader.readAsDataURL(this.blob);
        }

        async upload() {
            this.uploading = true;
            let data = new FormData();
            data.append('image', this.blob!);
            try {
                let result = await axios.post('https://api.imgur.com/3/image',
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${this.imgurAccess}`,
                            'Content-Type': 'multipart/form-data'
                        },
                    }
                );
                this.$emit('send', result.data.data.link);
            } catch (e) {
                console.warn(e);
                Cookies.remove(Cookie.Imgur);
            } finally {
                this.$emit('close');
            }
        }

        checkImgur() {
            let token = Cookies.get(Cookie.Imgur);
            if (!IsNullOrWhiteSpace(token)) {
                this.imgurAccess = token;
                this.x += 1;
            }

            window.removeEventListener('focus', this.checkImgur);
        }

        login() {
            window.addEventListener('focus', this.checkImgur);
            window.open(`https://api.imgur.com/oauth2/authorize?client_id=${process.env.imgur}&response_type=token`)
        }
    }
</script>

<style scoped>
    @import '@/assets/modal.css';

    .image {
        max-width: 100%;
        max-height: 80vh;
        margin: auto;
    }
</style>
