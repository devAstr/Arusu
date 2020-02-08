<template>
    <div class="text-center mb-4" v-if="vote != null">
        <do-vote @close="doing = false" v-if="doing && voteAvailable"/>
        <h4 class="mb-2">{{vote.title}}</h4>
        <poster-base :context="vote.poster.context"
                     :media="vote.poster.media"
                     v-if="voteAvailable && vote.poster != null">
        </poster-base>
        <b-table :class="{'table-dark': dark}" :fields="displayOptions" :items="vote.options" borderless class="rounded"
                 small
                 thead-class="hidden">
            <template v-slot:cell(option)="data">
                <div class="text-break text-left">{{ data.item.option }}</div>
            </template>
            <template v-slot:cell(stat)="data">
                <div :class="{'progress-dark': dark}" class="progress">
                    <div :style="{width : data.item.proportion}" class="progress-bar" role="progressbar"
                         style="min-width: 1rem">
                        {{ data.item.statistics }}
                    </div>
                </div>
            </template>
        </b-table>
        <div class="d-flex justify-content-between mb-2">
            <div>
                由
                <div :style="{color: dark ? vote.color.toDarkColor() : vote.color}" class="d-inline">
                    {{vote.name}}
                </div>
                發起
                @{{vote.time}}
            </div>
            <div class="d-none d-lg-flex between">
                <div>共有 {{vote.votedTimes}} 人投票</div>
                <div class="between ml-2" v-if="voteAvailable">
                    剩餘
                    <div style="width: 4rem">{{time}}</div>
                </div>
            </div>
        </div>
        <div class="clearfix">
            <div class="between-reverse" v-if="voteAvailable">
                <button :disabled="doVoteError != null"
                        @click="doing = true"
                        class="float-right btn btn-outline-primary"
                        v-if="voteAvailable">
                    {{voteDescription}}
                </button>
                <div class="between d-lg-none">
                    <div>共有 {{vote.votedTimes}} 人投票</div>
                    <div class="between ml-2" v-if="voteAvailable">
                        剩餘
                        <div style="width: 4rem">{{time}}</div>
                    </div>
                </div>
                <!--                <div class="between d-lg-none">-->
                <!--                    剩餘-->
                <!--                    <div style="width: 4rem">{{time}}</div>-->
                <!--                </div>-->
            </div>
            <div class="mb-2" v-else>
                投票結束
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, mixins, namespace, Watch} from 'nuxt-property-decorator';
    import PosterBase from '@/components/scaffolding/PosterBase.vue';
    import DoVote from '@/components/modals/DoVote.vue';
    import {default as VoteModel} from '@/models/Vote';
    import {VoteGetterType, VoteMutationType, VoteStateType} from '@/types/store/Vote';
    import HubBase from '@/components/scaffolding/HubBase';

    const VoteStore = namespace('Vote');

    @Component({components: {DoVote, HubBase, PosterBase}})
    export default class Vote extends mixins(HubBase) {
        @VoteStore.State(VoteStateType.Vote) vote!: VoteModel | null;
        @VoteStore.Mutation(VoteMutationType.SetExpired) setOverTime!: () => void;
        @VoteStore.Getter(VoteGetterType.DoVoteError) doVoteError!: string | null;
        @VoteStore.Getter(VoteGetterType.VoteAvailable) voteAvailable!: boolean;
        doing: boolean = false;
        timer: any = null;
        time: string | null = null;
        displayOptions = [
            {
                key: 'option',
                tdClass: 'optionCell align-middle'
            },
            {
                key: 'stat',
                tdClass: 'statCell align-middle'
            }
        ];

        get voteDescription(): string {
            return this.doVoteError ?? '投票！';
        }

        @Watch('vote', {immediate: true})
        onVoteChange(val: VoteModel | null) {
            if (val == null) {
                return;
            }
            clearInterval(this.timer);
            this.timer = setInterval(() => {
                let remaining = val.until - Date.now();
                if (remaining <= 0) {
                    this.setOverTime();
                    clearInterval(this.timer);
                    return;
                }

                let minInt = Math.floor(remaining / 1000 / 60 % 60);
                let minStr = (minInt >= 10 ? '' : '0') + minInt.toString();
                let secInt = Math.floor(remaining / 1000 % 60);
                let secStr = (secInt >= 10 ? '' : '0') + secInt.toString();
                let mscStr = Math.floor(remaining % 1000 / 100).toString();

                this.time = `${minStr}:${secStr}.${mscStr}`;
            }, 100)
        }
    }
</script>

<style scoped>
</style>

<style>
    @import "@/assets/general.css";
    @import "@/assets/table.css";

    .optionCell {
        width: 25%;
    }

    .progress-dark {
        background-color: darkgray;
    }
</style>
