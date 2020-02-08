<template>
    <div :class="modalMask" @click="close" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container">
            <div v-if="block != null">
                <div>{{block}}</div>
                <div class="mt-4 center">
                    <button @click="$emit('close')" class="btn btn-outline-secondary mx-2" type="button">
                        關閉
                    </button>
                </div>
            </div>
            <div v-else>
                <div>建立投票以 {{typeString}}</div>
                <h5 :style="{color : message.color}" class="my-3">{{ message.name }}</h5>
                <div class="mt-4 center">
                    <button :disabled="!canCreateVote" @click="send" class="btn btn-primary mx-2" type="button">確定
                    </button>
                    <button @click="$emit('close')" class="btn btn-outline-secondary mx-2" type="button">
                        取消
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins, namespace, Prop, State} from 'nuxt-property-decorator';
    import ModalBase from '@/components/scaffolding/ModalBase';
    import {RootStateType} from '@/types/store';
    import {ActionPermission, Select, ServerFunction} from '@/types/Types';
    import Message from '@/models/Message';
    import {NewTargetRequest} from '@/types/Requests';

    const VoteStore = namespace('Vote');

    @Component({components: {ModalBase}})
    export default class CreateFBVote extends mixins(ModalBase) {
        @State(RootStateType.Id) id!: string;
        @State(RootStateType.Name) name!: string;
        @VoteStore.Getter canCreateVote!: boolean;
        @Prop({default: null}) selectMode!: Select | null;
        @Prop({default: null}) message!: Message;

        get block(): string | null {
            if (this.selectMode === Select.Ban) {
                if (this.message.userId === this.id) {
                    return '您無法對自己發起封鎖投票';
                }

                if (this.message.permission == ActionPermission.Admin) {
                    return '您無法對管理員發起封鎖投票';
                }
            }

            return null;
        }

        get typeString(): string {
            switch (this.selectMode) {
                case Select.Ban:
                    return '封鎖';
                case Select.Fire:
                    return '火刑';
                default:
                    throw Error();
            }
        }

        async send() {
            if (!this.canCreateVote) {
                return;
            }

            if (this.selectMode == null || ![Select.Ban, Select.Fire].includes(this.selectMode)) {
                throw new Error('Incorrect f/b type selected');
            }

            await SignalRConnect.send(
                this.selectMode === Select.Ban ? ServerFunction.NewBanVote : ServerFunction.NewFireVote,
                new NewTargetRequest(this.hub, this.name, this.message.userId, this.message.name)
            );

            this.$emit('close');
        }
    }
</script>

<style scoped>
    @import '@/assets/general.css';
    @import '@/assets/modal.css';
</style>
