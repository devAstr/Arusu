<template>
    <div :class="modalMask" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container">
            <b-tabs :active-nav-item-class="{'active-dark': dark}" class="poster-editor" content-class="mt-3" justified>
                <b-tab active title="編輯">
                    <textarea :class="{'input-dark': dark}"
                        @blur="cleanContext"
                        class="form-control"
                        placeholder="可使用安全 HTML/CSS 語法與 Markdown 語法"
                        rows="6"
                        v-model="editContext">
                    </textarea>
                </b-tab>
                <b-tab :disabled="!valid" title="預覽">
                    <poster-base :context="editContext" :media="mediaUri"/>
                </b-tab>
            </b-tabs>
            <div class="mt-4 center">
                <button :disabled="!valid || !canCreateVote" @click="send" class="btn btn-primary mx-4" type="button">建立
                </button>
                <button @click="$emit('close')" class="btn btn-outline-secondary mx-4" type="button">
                    取消
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins, namespace, Prop, State} from 'nuxt-property-decorator';
    import {BTab, BTabs} from 'bootstrap-vue'
    import ModalBase from '@/components/scaffolding/ModalBase';
    import PosterBase from '@/components/scaffolding/PosterBase.vue';
    import Media from '@/models/Media';
    import {NewPosterVoteRequest} from '@/types/Requests';
    import {ServerFunction} from '@/types/Types';
    import {RootStateType} from '@/types/store';
    import {PosterStateType} from '@/types/store/Poster';
    import {VoteGetterType} from '@/types/store/Vote';
    import HtmlHelper from '@/helpers/HtmlHelper';

    const PosterStore = namespace('Poster');
    const VoteStore = namespace('Vote');

    @Component({components: {BTab, BTabs, ModalBase, PosterBase}})
    export default class CreatePosterVote extends mixins(ModalBase) {
        @State(RootStateType.Name) name!: string;
        @PosterStore.State(PosterStateType.Context) context!: string | null;
        @VoteStore.Getter(VoteGetterType.CanCreateVote) canCreateVote!: boolean;
        @Prop({default: null}) media!: Media | string | null;
        editContext: string = '';

        get valid(): boolean {
            return !IsNullOrWhiteSpace(this.editContext);
        }

        get mediaUri(): string | null {
            return typeof this.media === 'string' ? this.media : this.media?.uri ?? null;
        }

        cleanContext() {
            if (!this.valid) {
                return;
            }

            this.editContext = HtmlHelper.purify(this.editContext);
        }

        created() {
            this.editContext = this.context ?? '';
        }

        async send() {
            this.cleanContext();
            if (!this.valid) {
                return;
            }

            await SignalRConnect.send(
                ServerFunction.NewPosterVote,
                new NewPosterVoteRequest(this.hub, this.name, this.editContext, this.mediaUri)
            );
            this.$emit('close')
        }
    }
</script>

<style scoped>
    @import '@/assets/general.css';
    @import '@/assets/input.css';
    @import '@/assets/modal.css';

    .poster-editor {
        width: 32rem;
        height: 16rem;
    }
</style>

<style>
    .nav-link.active.active-dark {
        background-color: #0E3659;
        color: white;
    }
</style>
