import {ActionContext, ActionTree, GetterTree, MutationTree} from 'vuex';
import {RootStore} from '@/types/store';
import {INewVoteResponse, IVoteStatisticsResponse} from '@/types/Responses';
import Vote from '@/models/Vote';

export interface VoteStore {
    vote: Vote | null;
    voted: boolean;
    // time: string;
    // timeProtect: any;
}

export enum VoteStateType {
    Vote = 'vote',
    Voted = 'voted'
}

export interface VoteGetters extends GetterTree<VoteStore, RootStore> {
    voteAvailable: (state: VoteStore) => boolean;
    doVoteError: (state: VoteStore, getters: any, rootState: RootStore) => string | null;
    canVote: (state: VoteStore, getters: any, rootState: RootStore, rootGetters: any) => boolean;
    canCreateVote: (state: VoteStore, getters: any, rootState: RootStore, rootGetters: any) => boolean;
    canCreatePneumaVote: (state: VoteStore, getters: any, rootState: RootStore) => boolean;
    targets: (state: VoteStore) => string[] | null;
}

export enum VoteGetterType {
    VoteAvailable = 'voteAvailable',
    DoVoteError = 'doVoteError',
    CanVote = 'canVote',
    CanCreateVote = 'canCreateVote',
    CanCreatePneumaVote = 'canCreatePneumaVote',
    Targets = 'targets',
}

export interface VoteMutations extends MutationTree<VoteStore> {
    receive: (state: VoteStore, vote: Vote) => void;
    change: (state: VoteStore, stat: IVoteStatisticsResponse) => void;
    voted: (state: VoteStore) => void;
    setExpired: (state: VoteStore) => void;
    cleanup: (state: VoteStore) => void;
}

export enum VoteMutationType {
    Receive = 'receive',
    Change = 'change',
    Voted = 'voted',
    SetExpired = 'setExpired',
    Cleanup = 'cleanup',
}

export interface VoteActions extends ActionTree<VoteStore, RootStore> {
    receiveNew: ({commit, dispatch, state, rootState}: ActionContext<VoteStore, RootStore>,
                 response: INewVoteResponse) => void;
    receiveStat: ({commit, dispatch, state, rootState}: ActionContext<VoteStore, RootStore>,
                  response: IVoteStatisticsResponse) => void;
}

export enum VoteActionType {
    ReceiveNew = 'receiveNew',
    ReceiveStat = 'receiveStat'
}

export function global(name: VoteMutationType | VoteActionType) {
    return `Vote/${name}`;
}