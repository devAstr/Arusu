<template>
    <div :class="modalMask" @click="close" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container">
            <div class="form-group">
                <label for="title" style="font-size: 1.5rem">建立投票</label>
                <textarea :class="{'input-dark': dark}"
                          class="form-control"
                          id="title"
                          placeholder="輸入標題..."
                          required
                          rows="2" v-model="title">
                    </textarea>
                <div class="invalid-feedback">
                    缺少標題
                </div>
            </div>
            <div class="form-group createVoteForm">
                <input :class="{'input-dark': dark}"
                       class="form-control was-validated"
                       placeholder="選項 1"
                       required
                       type="text"
                       v-model="voteOptions[0]">
            </div>
            <div class="form-group createVoteForm">
                <input :class="{'input-dark': dark}"
                       class="form-control was-validated"
                       placeholder="選項 2"
                       required
                       type="text"
                       v-model="voteOptions[1]">
            </div>
            <div class="form-group createVoteForm">
                <input :class="{'input-dark': dark}"
                       :required="selectTypeOption > 1"
                       class="form-control"
                       placeholder="選項 3"
                       type="text"
                       v-model="voteOptions[2]">
            </div>
            <div class="form-group createVoteForm">
                <input :class="{'input-dark': dark}"
                       :required="selectTypeOption > 2"
                       class="form-control"
                       placeholder="選項 4"
                       type="text"
                       v-model="voteOptions[3]">
            </div>
            <div class="form-group createVoteForm">
                <input :class="{'input-dark': dark}"
                       :required="selectTypeOption > 3"
                       class="form-control"
                       placeholder="選項 5"
                       type="text"
                       v-model="voteOptions[4]">
            </div>
            <div class="form-group createVoteForm">
                <input :class="{'input-dark': dark}"
                       :required="selectTypeOption > 4"
                       class="form-control"
                       placeholder="選項 6"
                       type="text"
                       v-model="voteOptions[5]">
            </div>
            <div class="d-block d-lg-flex justify-content-between">
                <div class="mb-3 mb-lg-0">
                    <div class="btn-group">
                        <b-form-select :class="{'input-dark': dark}"
                                       :options="selectTypeOptions"
                                       class="float-left"
                                       text-field="text"
                                       v-model="selectTypeOption"
                                       value-field="value">
                        </b-form-select>
                    </div>
                </div>
                <div class="ml-0 ml-lg-3">
                    <div class="btn-group">
                        <b-form-radio-group :options="timeTypeOptions"
                                            button-variant="outline-primary"
                                            buttons
                                            class="float-right"
                                            v-model="timeTypeOption">
                        </b-form-radio-group>
                    </div>
                </div>
            </div>
            <div class="mt-4 center">
                <button :disabled="!valid" @click="send" class="btn btn-primary mx-4" type="button">建立</button>
                <button @click="$emit('close')" class="btn btn-outline-secondary mx-4" type="button">
                    取消
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins, namespace, State} from 'nuxt-property-decorator';
    import {BFormRadioGroup} from 'bootstrap-vue'
    import ModalBase from '@/components/scaffolding/ModalBase';
    import {ServerFunction, VoteSelectLimit, VoteTimeLimit} from '@/types/Types';
    import {NewFunVoteRequest} from '@/types/Requests';
    import {RootStateType} from '@/types/store';
    import {VoteGetterType} from '@/types/store/Vote';

    const VoteStore = namespace('Vote');

    @Component({components: {BFormRadioGroup, ModalBase}})
    export default class CreateFunVote extends mixins(ModalBase) {
        @State(RootStateType.Name) name!: string;
        @VoteStore.Getter(VoteGetterType.CanCreateVote) canCreateVote!: boolean;
        title: string = '';
        voteOptions: string[] = ['', '', '', '', '', ''];
        selectTypeOption: VoteSelectLimit = VoteSelectLimit.One;
        timeTypeOption: VoteTimeLimit = VoteTimeLimit.One;

        selectTypeOptions = [
            {text: '單選', value: VoteSelectLimit.One},
            {text: '最多 2 選項', value: VoteSelectLimit.Two},
            {text: '最多 3 選項', value: VoteSelectLimit.Three},
            {text: '最多 4 選項', value: VoteSelectLimit.Four},
            {text: '最多 5 選項', value: VoteSelectLimit.Five}
        ];

        timeTypeOptions = [
            {text: '30 秒', value: VoteTimeLimit.Half},
            {text: '60 秒', value: VoteTimeLimit.One},
            {text: '120 秒', value: VoteTimeLimit.Two},
        ];

        get valid(): boolean {
            return this.canCreateVote &&
                this.voteOptions.Distinct().filter(x => !IsNullOrWhiteSpace(x)).length > this.selectTypeOption &&
                !IsNullOrWhiteSpace(this.title);
        }

        async send() {
            if (!this.valid) {
                return;
            }

            await SignalRConnect.send(ServerFunction.NewFunVote,
                new NewFunVoteRequest(
                    this.hub,
                    this.name,
                    this.title,
                    this.voteOptions.Distinct().filter(x => !IsNullOrWhiteSpace(x)),
                    this.selectTypeOption,
                    this.timeTypeOption
                )
            );
            this.$emit('close')
        }
    }
</script>

<style scoped>
    @import '@/assets/general.css';
    @import '@/assets/input.css';
    @import '@/assets/modal.css';
</style>
