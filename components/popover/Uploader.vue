<template>
    <div class="center m-2">
        <div v-if="token == null">
            <button @click="login" class="btn btn-primary">登入 Imgur 以繼續</button>
        </div>
        <div v-else>
            <b-form-file :file-name-formatter="formatNames"
                         :placeholder="holder"
                         accept="image/*"
                         drop-placeholder="拖曳至此處..."
                         id="test"
                         ref="selector"
                         v-if="!uploading"
                         v-model="file">
            </b-form-file>
            <button :class="{invisible: uploading}"
                    :disabled="!Boolean(file)" :style="{display: uploading ? 'none' : ''}"
                    @click="upload"
                    class="btn btn-primary btn-block mt-2">
                上傳
            </button>
            <div v-if="uploading">
                <b-spinner :class="{'text-light': dark}" label="Uploading..."/>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
    import {Component, mixins, Watch} from 'nuxt-property-decorator';
    import {BFormFile} from 'bootstrap-vue'
    import * as Cookies from 'js-cookie';
    import axios from 'axios';
    import HubBase from '@/components/scaffolding/HubBase';

    @Component({components: {BFormFile, HubBase}})
    export default class Uploader extends mixins(HubBase) {
        // x: number = 1; // Force rerender v-if
        token: string | null = null;
        file: File | null = null;
        defaultHolder: string = '選擇檔案...';
        selected: boolean = false;
        uploading: boolean = false;
        url: string | null = null;

        get holder(): string {
            return this.selected ? '最大 10 MB' : this.defaultHolder;
        }

        @Watch('file')
        onFileChange(val: File | null) {
            if (val != null && val.size >= 9_999_999) {
                this.selected = true;
                (this.$refs.selector as any
                ).reset();
            }
        }

        created() {
            this.checkToken();
            this.$emit('toggle', true);
            window.addEventListener('click', this.close);
            window.addEventListener('focus', this.checkToken);
        }

        beforeDestroy() {
            window.removeEventListener('focus', this.checkToken);
        }

        upload() {
            if (!Boolean(this.file)) {
                return;
            }

            window.removeEventListener('click', this.close);
            this.uploading = true;
            let data = new FormData();
            data.append('image', this.file!);
            axios.post('https://api.imgur.com/3/image', data, {
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    'Content-Type': 'multipart/form-data'
                },
            }).then(response => {
                this.$emit('send', response.data.data.link);
                this.$emit('toggle', false);
                this.$emit('close');
            }).catch(() => {
                Cookies.remove('i');
                this.$emit('toggle', false);
                this.$emit('close');
            });
        }

        checkToken() {
            let token = Cookies.get('i');
            if (typeof token == 'string' && !IsNullOrWhiteSpace(token)) {
                this.token = token as string;
            }else{
                Cookies.remove('i');
            }
        }

        formatNames(file: File[]): string | null {
            if (file.length < 1) {
                return null;
            }

            let x = file[0].name.match(/\.(\w+)$/);
            return x != null && !IsNullOrWhiteSpace(x[1]) ? x[1] : '檔案';
        }

        login() {
            window.open(`https://api.imgur.com/oauth2/authorize?client_id=${process.env.imgur}&response_type=token`)
        }

        close(e: MouseEvent) {
            let container = document.querySelector('.popover-body') as HTMLElement;
            if (container !== null && !container.contains(e.target as Node)) {
                window.removeEventListener('click', this.close);
                this.$emit('toggle', false);
                this.$emit('close');
            }
        }
    }
</script>

<style scoped>
    @import '@/assets/general.css';
    @import '@/assets/input.css';
</style>
