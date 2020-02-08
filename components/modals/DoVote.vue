<template>
    <div :class="modalMask" @click="close" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container">
            <h2>{{vote.title}}</h2>
            <b-table :class="{'table-dark': dark}"
                     :fields="fields"
                     :items="vote.options"
                     :select-mode="selectMode"
                     :selected-variant="selectedClass"
                     @row-selected="x => selected = x"
                     borderless
                     class="rounded"
                     selectable
                     thead-class="hidden">
            </b-table>
            <div v-if="selectMode === 'multi'">
                <div v-if="available">
                    剩餘 {{ count }} 票
                </div>
                <div v-else>
                    您選擇了太多選項
                </div>
            </div>
            <div class="mt-4">
                <button :disabled="!available" @click="send" class="btn btn-primary btn-block">送出</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins, namespace} from 'nuxt-property-decorator';
    import ModalBase from '@/components/scaffolding/ModalBase';
    import Vote from '@/models/Vote';
    import {IVoteOption} from '@/types/Responses';
    import {DoVoteRequest} from '@/types/Requests';
    import {ServerFunction} from '@/types/Types';

    const VoteStore = namespace('Vote');

    @Component({components: {ModalBase}})
    export default class DoVote extends mixins(ModalBase) {
        @VoteStore.State vote!: Vote;
        @VoteStore.Mutation voted!: () => void;
        selected: IVoteOption[] = [];
        fields: string[] = ['option'];

        get selectedClass(): string {
            return this.available
                ? this.dark
                    ? 'info'
                    : 'success'
                : 'danger'
        }

        get selectMode(): string {
            return this.vote.selectLimit === 1 ? 'single' : 'multi';
        }

        get available(): boolean {
            return this.count >= 0 && this.count <= this.vote.selectLimit;
        }

        get count(): number {
            return this.vote.selectLimit - this.selected.length;
        }

        async send() {
            let selected = this.selected.map(x => x.option).Distinct().filter(x => !IsNullOrWhiteSpace(x));

            if (!this.available ||
                selected.length < 1 ||
                !selected.every(x => this.vote!.options.some(y => y.option === x))) {
                return new Error();
            }

            this.voted();
            await SignalRConnect.send(ServerFunction.DoVote, new DoVoteRequest(this.hub, selected));
            this.$emit('close');
        }
    }
</script>

<style scoped>
    @import '@/assets/modal.css';
    @import '@/assets/table.css';
</style>
