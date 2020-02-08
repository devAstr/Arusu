<template>
    <div>
        <create-f-b-vote :message="selected" :select-mode="selectMode" @close="onVoteClose" v-if="selected != null">
        </create-f-b-vote>
        <span :class="`modal-mask-${dark ? 'dark' : 'light'}`"
              @click="setSelectMode(null)"
              class="modal-mask"
              style="z-index: 1 !important;"
              v-if="selectMode != null"/>
        <b-table :class="tableClass"
                 :fields="messageDisplayOptions"
                 :items="messages"
                 :selectable="selectMode != null"
                 :tbody-tr-class="messageClass"
                 @row-selected="onMessageSelected"
                 borderless
                 class="messages align-middle"
                 select-mode="single"
                 small
                 thead-class="hidden">
            <template v-slot:cell(displayName)="data">
                <a :href="`#${data.item.userId}`"
                   :style="{color: dark ? data.item.darkColor : data.item.color}"
                   @click="doAt($event, data.item.name)">
                    {{data.item.name}}
                </a>
            </template>
            <template v-slot:cell()="data">
                <div>
                    <span :class="{'text-white': dark}" v-html="data.item.message"/>
                    <div class="time d-inline ml-2">{{data.item.time}}</div>
                </div>
            </template>
        </b-table>
    </div>
</template>

<script lang="ts">
    import {Component, mixins, namespace, State, Watch} from 'nuxt-property-decorator';
    import CreateFBVote from '@/components/modals/CreateFBVote.vue';
    import {Select} from '@/types/Types';
    import Message from '@/models/Message';
    import HubBase from '@/components/scaffolding/HubBase';
    import {RootStateType} from '@/types/store';
    import {MessageMutationType, MessageStateType} from '@/types/store/Message';
    import {VoteGetterType} from '@/types/store/Vote';
    import Regex from '@/types/Regex';

    const MessageStore = namespace('Message');
    const VoteStore = namespace('Vote');

    @Component({components: {CreateFBVote, HubBase}})
    export default class MessageList extends mixins(HubBase) {
        @State(RootStateType.Name) name!: string;
        @State(RootStateType.HistoryName) historyName!: string[];
        @MessageStore.State(MessageStateType.Messages) messages!: Message[];
        @MessageStore.State(MessageStateType.SelectMode) selectMode!: Select | null;
        @MessageStore.Mutation(MessageMutationType.SetAt) setAt!: (x: string | null) => void;
        @MessageStore.Mutation(MessageMutationType.SetSelectMode) setSelectMode!: (x: Select | null) => void;
        @VoteStore.Getter(VoteGetterType.Targets) targets!: string[] | null;
        @VoteStore.Getter(VoteGetterType.CanCreateVote) canCreateVote!: boolean;
        selected: Message | null = null;
        messageDisplayOptions = [
            {
                key: 'displayName',
                tdClass: 'nameCell align-middle'
            },
            {
                key: 'originalTime',
                tdClass: 'messageCell align-middle text-break'
            }
        ];

        get tableClass() {
            try {
                return {
                    'selectMode-light': this.selectMode != null && !this.dark,
                    'selectMode-dark': this.selectMode != null && this.dark,
                    'message-table-dark': this.dark
                }
            } finally {
                Regex.at.lastIndex = 0;
            }
        }

        @Watch('canCreateVote')
        onCanCreateVoteChange(val: boolean) {
            if (!val) {
                this.selected = null;
                this.setSelectMode(null);
            }
        }

        onVoteClose(){
            this.setSelectMode(null);
            this.selected = null
        }

        isTarget(item: Message): boolean {
            return item !== null && (this.targets?.includes(item.userId) ?? false);
        }

        doAt(e: MouseEvent, name: string) {
            e.preventDefault();
            if (this.selectMode === null) {
                this.setAt(name);
                document.getElementById('message-input')?.focus();
            }
        }

        getAt(item: Message): boolean {
            return [...item.message.matchAll(Regex.at)]
                .map(x => x[1])
                .Distinct()
                .some(x => this.name === x || this.historyName.includes(x));
        }

        messageClass(item: Message) {
            if (this.isTarget(item)) {
                return this.dark ? 'target-dark' : 'table-danger';
            }
            try {
                if (this.getAt(item)) {
                    return this.dark ? 'at-dark' : 'table-warning';
                }
            } finally {
                Regex.at.lastIndex = 0;
            }
        }

        onMessageSelected(items: Message[]) {
            if (this.selectMode == null) {
                return;
            }

            this.selected = items[0];
        }
    }
</script>

<style scoped>
    @import "@/assets/modal.css";
    @import "@/assets/table.css";

    .messages {
        position: relative;
        z-index: 10;
    }

    .time {
        font-size: 0.75rem;
        color: #7F7F7F;
    }

</style>

<style>
    @import "@/assets/emoji.css";
    @import "@/assets/table.css";

    .message-table-dark {
        background-color: #000000;
    }

    .nameCell {
        width: 8rem;
        font-size: 0.9rem;
        text-align: left;
        word-break: break-all;
    }

    .at-dark {
        background-color: #803500 !important;
    }

    .target-dark {
        background-color: #8C0D2F !important;
    }

    .messageCell {
        text-align: left;
        word-break: revert;
    }

    .hidden {
        display: none;
    }

    .selectMode-light {
        background: white;
    }

    .selectMode-dark {
        background: black;
    }
</style>
