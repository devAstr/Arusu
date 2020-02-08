import {ActionPermission, PneumaRestriction, VoteSelectLimit, VoteType} from '@/types/Types';

export interface ILoginResponse {
    id: string;
    pneuma: number | null;
    freeze: number;
    restriction: number;
    needLogin: boolean;
}

export interface INewMessageResponse {
    userId: string;
    name: string;
    color: string;
    message: string;
    time: number;
    permission: ActionPermission | null;
}

export interface INewVoteResponse {
    name: string;
    color: string;
    time: number;
    title: string;
    options: string[];
    selectLimit: VoteSelectLimit;
    remaining: number;
    voteType: VoteType;
    payload: any;
}

export interface INewPosterResponse {
    poster: IPoster;
    time: number;
}

export interface INotificationResponse {
    title: string;
    message: string;
}

export interface IOnlineUserResponse {
    number: number;
}

export interface IPneumaChangeResponse {
    pneuma: number;
}

export interface IRestrictionChangeResponse {
    restriction: PneumaRestriction | null;
}

export interface IVoteStatisticsResponse {
    name: string;
    color: string;
    time: number;
    title: string;
    remaining: number;
    options: IVoteOption[],
    votedTimes: number,
}

export interface IAnnouncementResponse {
    title: string;
    message: string;
}

export interface IVoteOption {
    option: string;
    statistics: number
}

export interface IPoster {
    media: string | null;
    context: string;
    time: number
}
