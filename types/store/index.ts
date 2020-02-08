import {ActionContext, ActionTree, GetterTree, MutationTree} from 'vuex';
import {IAnnouncementResponse, ILoginResponse, INotificationResponse} from '@/types/Responses';
import {PneumaRestriction} from '@/types/Types';
import {MessageStore} from '@/types/store/Message';
import {MediaStore} from '@/types/store/Media';
import {PosterStore} from '@/types/store/Poster';
import {VoteStore} from '@/types/store/Vote';

export interface RootStore {
    // Function
    onlineUser: number;
    notification: INotificationResponse | null;
    announcement: IAnnouncementResponse | null;

    // User information
    id: string;
    // logged: boolean;
    pneuma: number | null;
    restriction: number | null;
    freeze: number | null;
    needLogin: boolean;
    baned: boolean;
    overheat: boolean;
    coldDown: boolean;

    // Preferences
    name: string;
    openMedia: boolean;
    openPoster: boolean;
    openVote: boolean;
    dark: boolean;

    // System
    historyName: string[];
    loading: boolean;
    blur: boolean;
    lastMessage: string | null;
    disconnectState: boolean;
    otherError: string | null;

    Media?: MediaStore;
    Message?: MessageStore;
    Poster?: PosterStore;
    Vote?: VoteStore;
}

export enum RootStateType {
    OnlineUser = 'onlineUser',
    Notification = 'notification',
    Announcement = 'announcement',
    Id = 'id',
    // Logged          = 'logged',
    Baned = 'baned',
    Pneuma = 'pneuma',
    Restriction = 'restriction',
    Freeze = 'freeze',
    NeedLogin = 'needLogin',
    Overheat = 'overheat',
    ColdDown = 'coldDown',
    Name = 'name',
    OpenMedia = 'openMedia',
    OpenPoster = 'openPoster',
    OpenVote = 'openVote',
    Dark = 'dark',
    HistoryName = 'historyName',
    Loading = 'loading',
    Blur = 'blur',
    LastMessage = 'lastMessage',
    DisconnectState = 'disconnectState',
    OtherError = 'otherError'
}

export interface RootGetters extends GetterTree<RootStore, RootStore> {
    logged: (state: RootStore) => boolean;
    freeze: (state: RootStore) => boolean;
    restricted: (state: RootStore) => boolean;
    canBuyItem: (state: RootStore) => boolean;
    error: (state: RootStore, getters: any) => string | null;
}

export enum RootGetterType {
    Logged = 'logged',
    Freeze = 'freeze',
    Restricted = 'restricted',
    CanBuyItem = 'canBuyItem',
    Error = 'error'
}

export interface RootMutations extends MutationTree<RootStore> {
    setOnlineUser: (state: RootStore, user: number) => void;
    setNotification: (state: RootStore, response: INotificationResponse) => void;
    setAnnouncement: (state: RootStore, response: IAnnouncementResponse | null) => void;
    setBan: (state: RootStore) => void;
    setPneuma: (state: RootStore, pneuma: number | null) => void;
    setRestriction: (state: RootStore, type: PneumaRestriction | null) => void;
    setOverheat: (state: RootStore, overheat: boolean) => void;
    setColdDown: (state: RootStore, coldDown: boolean) => void;

    setName: (state: RootStore, name: string) => void;
    setOpenMedia: (state: RootStore, openMedia: boolean) => void;
    setOpenPoster: (state: RootStore, openPoster: boolean) => void;
    setOpenVote: (state: RootStore, openVote: boolean) => void;
    setDark: (state: RootStore, dark: boolean) => void;

    setLoading: (state: RootStore, loading: boolean) => void;
    setBlur: (state: RootStore, blur: boolean) => void;
    setLastMessage: (state: RootStore, message: string | null) => void;
    setDisconnectState: (state: RootStore, disconnectState: boolean) => void;
    setOtherError: (state: RootStore, error: string) => void;

    login: (state: RootStore, response: ILoginResponse) => void;
    cleanup: (state: RootStore) => void;
}

export enum RootMutationType {
    SetOnlineUser = 'setOnlineUser',
    SetNotification = 'setNotification',
    SetAnnouncement = 'setAnnouncement',
    SetBan = 'setBan',
    SetPneuma = 'setPneuma',
    SetRestriction = 'setRestriction',
    SetOverheat = 'setOverheat',
    SetColdDown = 'setColdDown',
    SetName = 'setName',
    SetOpenMedia = 'setOpenMedia',
    SetOpenPoster = 'setOpenPoster',
    SetOpenVote = 'setOpenVote',
    SetDark = 'setDark',
    SetLoading = 'setLoading',
    SetBlur = 'setBlur',
    SetLastMessage = 'setLastMessage',
    SetDisconnectState = 'setDisconnectState',
    SetOtherError = 'setOtherError',
    Login = 'login',
    Cleanup = 'cleanup',
}

export interface RootActions extends ActionTree<RootStore, RootStore> {
    setResponseProcessor: ({commit, dispatch}: ActionContext<RootStore, RootStore>) => void
    cleanup: ({commit}: ActionContext<RootStore, RootStore>) => void;
}

export enum RootActionType {
    SetResponseProcessor = 'setResponseProcessor',
    Cleanup = 'cleanup'
}