import {ActionContext} from 'vuex';
import {VoteActions, VoteGetters, VoteMutations, VoteMutationType, VoteStore} from '@/types/store/Vote';
import Vote from '@/models/Vote';
import {RootStore} from '@/types/store';
import {INewVoteResponse, IVoteStatisticsResponse} from '@/types/Responses';

export const state: () => VoteStore = () => <VoteStore>{
    vote: null,
    voted: false,
};

export const getters: VoteGetters = <VoteGetters>{
    voteAvailable(state: VoteStore): boolean {
        return state.vote != null && !state.vote!.expired;
    },

    doVoteError(state: VoteStore, getters: any, rootState: RootStore): string | null {
        if (state.vote == null || state.vote!.expired) {
            console.warn('No vote exist, but render do vote button');
            return '';
        }

        if (rootState.baned) {
            return '已被封鎖';
        }
        if (rootState.freeze) {
            return '權限被凍結'
        }
        if (state.vote.targets?.includes(rootState.id)) {
            return '您是投票目標';
        }

        if (state.vote.isFunctionalVote) {
            if (rootState.pneuma == null) {
                return '需要登入';
            }
            if (rootState.pneuma < (state.vote.pneumaLevel ?? 0) || // Pneuma should >= target level
                rootState.pneuma < (rootState.restriction ?? -1)) { // Pneuma should >= restriction
                return '未達門檻';
            }
        }

        if (state.voted) {
            return '已投票';
        }

        if (state.vote.overTimeBlockVote) {
            return '無法投票';
        }

        if (!getters.voteAvailable) {
            console.warn('Should pass test, but not');
            return '';
        }

        return null
    },

    canCreateVote(_, getters, _2, rootGetters): boolean {
        return !getters.voteAvailable && !rootGetters.freeze;
    },

    targets(state: VoteStore): string[] | null {
        return state.vote == null || state.vote.expired
            ? null
            : state.vote.targets ?? null;
    }
};

export const mutations: VoteMutations = <VoteMutations>{
    receive(state: VoteStore, vote: Vote): void {
        state.vote = vote;
        state.voted = false;
    },

    change(state: VoteStore, stat: IVoteStatisticsResponse): void {
        state.vote?.change(stat);
    },

    voted(state: VoteStore): void {
        state.voted = true;
    },

    setExpired(state: VoteStore): void {
        if (state.vote == null) {
            return;
        }

        state.vote.expired = true;
    },

    cleanup(state: VoteStore) {
        state.vote = null;
        state.voted = false;
    }
};

export const actions: VoteActions = <VoteActions>{
    receiveNew({commit, dispatch, state, rootState}: ActionContext<VoteStore, RootStore>, response: INewVoteResponse) {
        let vote = Vote.createFromNewVoteResponse(response);

        commit(VoteMutationType.Receive, vote);
    },

    receiveStat({commit, dispatch, state, rootState}: ActionContext<VoteStore, RootStore>, response: IVoteStatisticsResponse) {
        if (state.vote != null) {
            commit(VoteMutationType.Change, response);
            return;
        }

        let vote = Vote.createFromVoteStatisticsResponse(response);

        commit(VoteMutationType.Receive, vote);
    },
};
