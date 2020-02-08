<template>
    <div :class="modalMask" @click="close" class="modal-mask">
        <div :class="modalContainerMask" class="modal-container">
            <h4 class="m-2 mb-4">建立投票以變更門檻為</h4>
            <b-table :class="{'table-dark': dark}"
                     :fields="fields"
                     :items="options"
                     @row-selected="onPneumaSelected"
                     borderless
                     select-mode="single"
                     selectable
                     thead-class="hidden">
            </b-table>
            <div class="mt-4 d-flex center">
                <button :disabled="select === null"
                        @click="send"
                        class="btn btn-primary mx-4"
                        type="button">
                    確定
                </button>
                <button @click="$emit('close')"
                        class="btn btn-outline-secondary mx-4"
                        type="button">
                    取消
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins, State} from 'nuxt-property-decorator';
    import ModalBase from '@/components/scaffolding/ModalBase';
    import {PneumaRestriction, ServerFunction} from '@/types/Types';
    import {NewPneumaVoteRequest} from '@/types/Requests';
    import {RootStateType} from '@/types/store';

    @Component({components: {ModalBase}})
    export default class CreatePneumaVote extends mixins(ModalBase) {
        @State(RootStateType.Name) name!: string;
        @State(RootStateType.Pneuma) pneuma!: number;
        @State(RootStateType.Restriction) restriction!: number;

        allOptions: { name: string, value: PneumaRestriction | null }[] = [
            {name: '移除所有門檻', value: PneumaRestriction.None},
            {name: '0', value: PneumaRestriction.L0},
            {name: '5', value: PneumaRestriction.L5},
            {name: '10', value: PneumaRestriction.L10},
            {name: '20, 封鎖未登入', value: PneumaRestriction.L20},
            {name: '40, 封鎖 1', value: PneumaRestriction.L40},
            {name: '80, 封鎖 5', value: PneumaRestriction.L80},
            {name: '120, 封鎖 10', value: PneumaRestriction.L120},
            {name: '160, 封鎖 20', value: PneumaRestriction.L160}
        ];
        fields: string[] = ['name'];
        select: { name: string, value: PneumaRestriction } | null = null;

        get options(): { name: string, value: PneumaRestriction | null }[] {
            let result = this.allOptions.filter(x => (x.value ?? -1) <= this.pneuma && x.value !== this.restriction);
            if (result.length < 2) {
                throw new Error();
            }

            return result;
        }

        async send() {
            if (this.select === null) {
                return;
            }

            await SignalRConnect.send(ServerFunction.NewPneumaVote,
                new NewPneumaVoteRequest(this.hub, this.name, this.select.value)
            );
            this.$emit('close')
        }

        onPneumaSelected(items: Array<{ name: string, value: PneumaRestriction }>) {
            this.select = items[0];
        }
    }
</script>

<style scoped>
    @import '@/assets/general.css';
    @import '@/assets/modal.css';
    @import '@/assets/table.css';
</style>
