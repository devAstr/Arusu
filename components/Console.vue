<template>
    <div :style="{background: dark ? '#0E3659' : '#e8eef5'}" class="console" id="console">
        <paste-image :blob="pasteFile" @close="pasteFile = null" @send="sendImage" v-if="pasteFile != null"/>
        <create-fun-vote @close="fun = false" v-if="fun && canCreateVote"/>
        <create-pneuma-vote @close="pneumaOpen = false" v-if="pneumaOpen && canCreateVote"/>
        <user-list @close="userList = false" v-if="userList"/>
        <div>
            <div :class="dark ? 'block-dark' : 'table-danger'" class="block center" v-if="block != null">
                <div>
                    {{block}}
                </div>
            </div>
            <div :style="{visibility: block != null ? 'hidden' : 'visible'}">
                <div class="d-flex justify-content-around mt-2 mb-3 d-lg-none">
                    <div class="d-inline">
                        <input class="icon ml-1" id="sticker2" src="@/assets/sticker.png" type="image"/>
                        <b-popover :custom-class="`popover-size${dark ? ' popover-dark' : '' }`"
                                   :show.sync="sticker"
                                   boundary="viewport"
                                   container="hub"
                                   placement="bottomright"
                                   target="sticker2"
                                   triggers="click blur">
                            <sticker-picker @attach="x => message += x" @close="closeSticker"/>
                        </b-popover>
                    </div>
                    <div class="d-inline" v-if="logged">
                        <input class="icon ml-1" id="upload2" src="@/assets/upload.png" type="image"/>
                        <b-popover :custom-class="`popover-size${dark ? ' popover-dark' : '' }`"
                                   :disabled="uploaderFreeze"
                                   :show.sync="upload"
                                   boundary="viewport"
                                   container="hub"
                                   placement="bottomright"
                                   target="upload2"
                                   triggers="click">
                            <uploader @close="upload = false" @send="sendImage" @toggle="(x) => uploaderFreeze = x"/>
                        </b-popover>
                    </div>
                    <input @click="userList = true" class="icon" src="@/assets/people.png" type="image"/>
                    <input :disabled="!canCreateVote" @click="fun = true" class="icon" src="@/assets/vote.png"
                           type="image"/>
                    <input :disabled="!canCreateVote" @click="fire" class="icon" src="@/assets/fire.png" type="image"/>
                    <input :disabled="!canCreateVote" @click="ban" class="icon" src="@/assets/ban.png" type="image"/>
                    <input :disabled="!canCreatePneumaVote"
                           @click="pneumaOpen = true"
                           class="icon"
                           src="@/assets/pneuma.png"
                           type="image"/>
                </div>
                <table>
                    <tr>
                        <td style="width: 2.6rem;">暱稱</td>
                        <td class="d-flex">
                            <input :class="{'input-dark': dark}"
                                   @blur="nameChange"
                                   class="form-control mr-2"
                                   style="width: 10rem;"
                                   v-model="editableName"/>
                            <div class="d-none d-lg-block">
                                <div class="d-inline">
                                    <input class="icon ml-1" id="sticker1" src="@/assets/sticker.png" type="image"/>
                                    <b-popover :custom-class="`popover-size${dark ? ' popover-dark' : '' }`"
                                               :show.sync="sticker"
                                               boundary="viewport"
                                               container="hub"
                                               placement="bottom"
                                               target="sticker1"
                                               triggers="click blur">
                                        <sticker-picker @attach="x => message += x" @close="closeSticker"/>
                                    </b-popover>
                                </div>
                                <div class="d-inline" v-if="logged">
                                    <input class="icon ml-1" id="upload1" src="@/assets/upload.png" type="image"/>
                                    <b-popover :custom-class="`popover-size${dark ? ' popover-dark' : '' }`"
                                               :disabled="uploaderFreeze"
                                               :show.sync="upload"
                                               boundary="viewport"
                                               container="hub"
                                               placement="bottom"
                                               target="upload1"
                                               triggers="click blur">
                                        <uploader @close="upload = false" @send="sendImage"
                                                  @toggle="(x) => uploaderFreeze = x"/>
                                    </b-popover>
                                </div>
                                <input @click="userList = true" class="icon ml-1" src="@/assets/people.png"
                                       type="image"/>
                                <input :disabled="!canCreateVote"
                                       @click="fun = true"
                                       class="icon ml-1"
                                       src="@/assets/vote.png"
                                       type="image"/>
                                <input :disabled="!canCreateVote" @click="fire" class="icon ml-1"
                                       src="@/assets/fire.png" type="image"/>
                                <input :disabled="!canCreateVote" @click="ban" class="icon ml-1" src="@/assets/ban.png"
                                       type="image"/>
                                <input :disabled="!canCreatePneumaVote"
                                       @click="pneumaOpen = true"
                                       class="icon ml-1"
                                       src="@/assets/pneuma.png"
                                       type="image"/>
                            </div>
                            <button :disabled="!messageIsValid" @click="send" class="btn btn-primary ml-2">送出</button>
                            <span class="flex-grow-1"/>
                        </td>
                    </tr>
                    <tr>
                        <td>訊息</td>
                        <td>
              <textarea :class="{'input-dark': dark}"
                        @blur="cleanMessage"
                        @keypress.enter="enterSend"
                        class="form-control"
                        id="message-input"
                        placeholder="輸入訊息"
                        rows="2"
                        v-model="message">
              </textarea>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Getter, mixins, Mutation, namespace, State, Watch} from 'nuxt-property-decorator';
    import {BPopover} from 'bootstrap-vue'
    import * as Cookies from 'js-cookie';
    import CreateFunVote from '@/components/modals/CreateFunVote.vue';
    import CreatePneumaVote from '@/components/modals/CreatePneumaVote.vue';
    import Loading from '@/components/modals/Loading.vue';
    import PasteImage from '@/components/modals/PasteImage.vue';
    import UserList from '@/components/modals/UserList.vue';
    import StickerPicker from '@/components/popover/StickerPicker.vue';
    import Uploader from '@/components/popover/Uploader.vue';
    import HubBase from '@/components/scaffolding/HubBase';
    import {PneumaRestriction, PneumaRestrictionList, Select, ServerFunction} from '@/types/Types';
    import {ChangeNameRequest, NewMessageRequest} from '@/types/Requests';
    import {RootGetterType, RootMutationType, RootStateType} from '@/types/store';
    import {MessageMutationType, MessageStateType} from '@/types/store/Message';
    import {VoteGetterType} from '@/types/store/Vote';

    const MessageStore = namespace('Message');
    const VoteStore = namespace('Vote');

    @Component({
        components: {
            BPopover,
            CreatePneumaVote,
            CreateFunVote,
            HubBase,
            PasteImage,
            StickerPicker,
            Loading,
            Uploader,
            UserList
        }
    })
    export default class Console extends mixins(HubBase) {
        @State(RootStateType.Pneuma) pneuma!: number;
        @State(RootStateType.Restriction) restriction!: number;
        @State(RootStateType.Name) name!: string;
        @State(RootStateType.ColdDown) coldDown!: boolean;
        @Getter(RootGetterType.Restricted) restricted!: boolean;
        @Getter(RootGetterType.Error) error!: string;
        @Mutation(RootMutationType.SetOverheat) setOverheat!: (x: boolean) => void;
        @Mutation(RootMutationType.SetColdDown) setColdDown!: (x: boolean) => void;
        @Mutation(RootMutationType.SetName) setName!: (x: string) => void;
        @MessageStore.State(MessageStateType.At) at!: string | null;
        @MessageStore.Mutation(MessageMutationType.SetAt) setAt!: (x: string | null) => void;
        @MessageStore.Mutation(MessageMutationType.SetSelectMode) setSelectMode!: (x: Select) => void;
        @VoteStore.Getter(VoteGetterType.CanCreateVote) canCreateVote!: boolean;

        sticker: boolean = false;
        upload: boolean = false;
        uploaderFreeze: boolean = false;
        fun: boolean = false;
        pneumaOpen: boolean = false;
        userList: boolean = false;
        pasteFile: File | null = null;
        editableName: string = '';
        message: string = '';
        times: number = 0;

        get logged(): boolean {
            return this.pneuma != null;
        }

        get messageIsValid(): boolean {
            return !IsNullOrWhiteSpace(this.message);
        }

        get block(): string | null {
            return this.error != null && !IsNullOrWhiteSpace(this.error) ? this.error : null;
        }

        get canCreatePneumaVote(): boolean {
            return this.logged && this.pneuma > (this.restriction ?? -1) &&
                PneumaRestrictionList.filter(x => (x ?? -1) <= this.pneuma && x != this.restriction).length > 1;
        }

        @Watch('at')
        onAtChange(val: string | null) {
            if (val == null) {
                return;
            }

            this.cleanMessage();
            this.message += ` @${val} `;
            this.setAt(null);
        }

        @Watch('restriction')
        onRestrictionChange(val: number) {
            if (val == PneumaRestriction.Infinity) {
                this.$router.replace('/');
            }
        }

        @Watch('coldDown', {immediate: true})
        onColdDownChange(val: boolean) {
            if (val) {
                setTimeout(() => this.setColdDown(false), 1000 * 60);
            }
        }

        created() {
            this.editableName = this.name;
            document.addEventListener('paste', this.paste);
        }

        beforeDestroy() {
            document.removeEventListener('paste', this.paste);
        }

        closeSticker(focus: boolean) {
            this.sticker = false;
            if (focus) {
                document.getElementById('message-input')?.focus();
            }
        }

        cleanMessage() {
            this.message = this.message.trim();
        }

        paste(e: ClipboardEvent) {
            if (!IsNullOrWhiteSpace(this.error) || !this.logged) {
                return;
            }

            this.pasteFile = (e.clipboardData?.items as DataTransferItemList)
                ?.find(x => x.kind === 'file' && x.type.startsWith('image'))
                ?.getAsFile() as File | null;

            if (this.pasteFile != null) {
                e.preventDefault();
            }
        }

        ban() {
            this.setSelectMode(Select.Ban);
        }

        fire() {
            this.setSelectMode(Select.Fire);
        }

        async send() {
            if (this.messageIsValid && this.block == null) {
                if (this.restricted) {
                    this.setColdDown(true);
                } else {
                    if (this.times > 3) {
                        this.setOverheat(true);
                        setTimeout(() => this.setOverheat(false), 1000 * 120);
                        return;
                    }

                    this.times += 1;
                    setTimeout(() => this.times -= 1, 1000 * 10)
                }

                await SignalRConnect.send(
                    ServerFunction.NewMessage,
                    new NewMessageRequest(this.hub, this.name, this.message)
                );
                this.message = '';
            }
        }

        sendImage(uri: string) {
            this.message = uri;
            this.send();
        }

        nameChange() {
            this.editableName = this.editableName.replace(/ /g, '');
            if (this.editableName.length < 16) {
                this.editableName = this.editableName.substr(0, 16);
            }
            if (IsNullOrWhiteSpace(this.editableName)) {
                this.editableName = this.name;
            } else {
                this.setName(this.editableName);
                Cookies.set('name', this.editableName as string, {expires: 3650});
                SignalRConnect.send(ServerFunction.ChangeName, new ChangeNameRequest(this.hub, this.editableName));
            }
        }

        enterSend(e: KeyboardEvent) {
            e.preventDefault();
            this.send();
        }
    }
</script>

<style scoped>
    @import '@/assets/general.css';
    @import '@/assets/input.css';

    .console {
        width: 100%;
        position: relative;
        padding: .25rem;
        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;
    }

    .icon {
        width: 32px;
        height: 32px;
        border-radius: .25rem;
    }

    .block {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        align-items: center;
    }

    .popover-size {
        min-width: 20rem;
    }

    .popover-dark {
        background-color: #1c1c1e;
    }

    .block-dark {
        background-color: #8C0D2F;
    }
</style>
