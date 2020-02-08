import {ActionContext} from 'vuex';
import {RootActions, RootGetters, RootMutations, RootMutationType, RootStore} from '@/types/store';
import {global as globalMedia, MediaMutationType} from '@/types/store/Media';
import {global as globalMessage, MessageActionType, MessageMutationType} from '@/types/store/Message';
import {global as globalPoster, PosterMutationType} from '@/types/store/Poster';
import {global as globalVote, VoteActionType, VoteMutationType} from '@/types/store/Vote';
import {
    IAnnouncementResponse,
    ILoginResponse,
    INotificationResponse,
    IOnlineUserResponse,
    IPneumaChangeResponse,
    IRestrictionChangeResponse
} from '@/types/Responses';
import {ClientFunction, Cookie, PneumaRestriction} from '@/types/Types';
import PneumaHelper from '@/helpers/PneumaHelper';
import * as Cookies from 'js-cookie';

export const state: () => RootStore = () => <RootStore>{
    // Function
    onlineUser: 0,
    notification: null,
    announcement: null,

    // User information
    id: '',
    // logged:      false,
    baned: false,
    pneuma: null,
    restriction: 0,
    freeze: 0,
    needLogin: true,
    overheat: false,
    coldDown: false,

    // Preferences
    name: '',
    openMedia: false,
    openPoster: false,
    openVote: false,
    dark: false,

    // System
    historyName: [],
    loading: true,
    blur: false,
    lastMessage: null,
    disconnectState: false,
    otherError: null,
};

export const getters: RootGetters = <RootGetters>{
    logged: (state: RootStore): boolean => state.pneuma != null,

    freeze: (state: RootStore): boolean => state.freeze != null &&
        (state.pneuma == null || state.pneuma < state.freeze),

    restricted: (state: RootStore): boolean => state.restriction != null && (state.pneuma ?? -1) < state.restriction,

    canBuyItem: (state: RootStore): boolean => (state.pneuma ?? 0) > 0,

    error: (state: RootStore, getters: any): string | null => {
        if (state.disconnectState) {
            return '連線已中斷';
        }
        if (state.baned) {
            return '已被封鎖';
        }
        if (!IsNullOrWhiteSpace(state.otherError)) {
            return state.otherError;
        }
        if (state.needLogin && state.pneuma == null) {
            return '已啟用新看板限制，請登入或聯絡管理員';
        }
        if (getters.freeze) {
            return state.pneuma == null
                ? '權限被凍結 登入來累積 Sync 以解鎖'
                : '權限被凍結 累積更多 Sync 以解鎖';
        }
        if (state.coldDown) {
            return '冷卻中，累積更多 Sync 以解除限制';
        }
        if (state.overheat) {
            return '超載，冷卻中';
        }
        return null;
    },
};

export const mutations: RootMutations = <RootMutations>{
    setOnlineUser(state: RootStore, user: number) {
        state.onlineUser = user;
    },

    setNotification(state: RootStore, response: INotificationResponse) {
        state.notification = response;
    },

    setAnnouncement(state: RootStore, response: IAnnouncementResponse | null) {
        state.announcement = response;
    },

    setBan(state: RootStore) {
        state.baned = true;
    },

    setPneuma(state: RootStore, pneuma: number | null) {
        state.pneuma = pneuma;
    },

    setRestriction(state: RootStore, type: PneumaRestriction | null) {
        state.restriction = type;
        state.freeze = PneumaHelper.RestrictionToFreeze(type);
    },

    setOverheat(state: RootStore, overheat: boolean) {
        state.overheat = overheat
    },

    setColdDown(state: RootStore, coldDown: boolean) {
        state.coldDown = coldDown
    },

    setName(state: RootStore, name: string) {
        if (!IsNullOrWhiteSpace(state.name)) {
            state.historyName.push(state.name);
        }
        state.name = name;
    },

    setOpenMedia(state: RootStore, openMedia: boolean) {
        state.openMedia = openMedia;
        Cookies.set(Cookie.OpenMedia, openMedia.toString(), {expires: 3650});
    },

    setOpenPoster(state: RootStore, openPoster: boolean) {
        state.openPoster = openPoster;
        Cookies.set(Cookie.OpenPoster, openPoster.toString(), {expires: 3650});
    },

    setOpenVote(state: RootStore, openVote: boolean) {
        state.openVote = openVote;
        Cookies.set(Cookie.OpenVote, openVote.toString(), {expires: 3650});
    },

    setDark(state: RootStore, dark: boolean) {
        state.dark = dark;
        Cookies.set(Cookie.Dark, dark.toString(), {expires: 3650});
    },

    setLoading(state: RootStore, loading: boolean) {
        state.loading = loading;
    },

    setBlur(state: RootStore, blur: boolean) {
        state.blur = blur
    },

    setLastMessage(state: RootStore, message: string | null) {
        if (state.blur || message == null) {
            state.lastMessage = message;
        }
    },

    setDisconnectState(state: RootStore, disconnectState: boolean) {
        state.disconnectState = disconnectState;
    },

    setOtherError(state: RootStore, error: string) {
        state.otherError = error;
    },

    login(state: RootStore, response: ILoginResponse) {
        state.id = response.id;
        state.pneuma = response.pneuma;
        state.freeze = response.freeze;
        state.restriction = response.restriction;
        state.needLogin = response.needLogin;

        if (response.pneuma == null) {
            Cookies.remove(Cookie.AccessToken);
        }

        if (state.restriction != null && (state.pneuma ?? -1) < state.restriction) {
            state.coldDown = true;
        }
    },

    cleanup(state: RootStore) {
        state.onlineUser = 0;
        state.notification = null;
        state.announcement = null;

        state.id = '';
        state.pneuma = null;
        state.restriction = 0;
        state.freeze = 0;
        state.baned = false;
        state.overheat = false;
        state.coldDown = false;

        state.historyName = [];
        state.loading = false;
        state.blur = false;
        state.lastMessage = null;
        state.disconnectState = false;
        state.otherError = null;
    }
};

export const actions: RootActions = <RootActions>{
    cleanup({commit}: ActionContext<RootStore, RootStore>): void {
        commit(RootMutationType.SetLoading, true);
        commit(RootMutationType.Cleanup);
        commit(globalMedia(MediaMutationType.Cleanup), null, {root: true});
        commit(globalMessage(MessageMutationType.Cleanup), null, {root: true});
        commit(globalPoster(PosterMutationType.Cleanup), null, {root: true});
        commit(globalVote(VoteMutationType.Cleanup), null, {root: true});
    },

    setResponseProcessor({commit, dispatch}: ActionContext<RootStore, RootStore>) {
        SignalRConnect.on(ClientFunction.OnlineUser,
            (x: IOnlineUserResponse) => commit(RootMutationType.SetOnlineUser, x.number));

        SignalRConnect.on(ClientFunction.Notification,
            (x) => commit(RootMutationType.SetNotification, x));

        SignalRConnect.on(ClientFunction.PneumaChange,
            (x: IPneumaChangeResponse) => commit(RootMutationType.SetPneuma, x.pneuma));

        SignalRConnect.on(ClientFunction.RestrictionChange,
            (x: IRestrictionChangeResponse) => commit(RootMutationType.SetRestriction, x.restriction));

        SignalRConnect.on(ClientFunction.HubBaned,
            () => commit(RootMutationType.SetRestriction, PneumaRestriction.Infinity));

        SignalRConnect.on(ClientFunction.Announcement, (x) => commit(RootMutationType.SetAnnouncement, x));
        SignalRConnect.on(ClientFunction.Notification, (x) => commit(RootMutationType.SetNotification, x));
        SignalRConnect.on(ClientFunction.Login, (x) => commit(RootMutationType.Login, x));
        SignalRConnect.on(ClientFunction.Ban, () => commit(RootMutationType.SetBan));
        SignalRConnect.on(ClientFunction.Ready, () => commit(RootMutationType.SetLoading, false));

        SignalRConnect.on(ClientFunction.NewMessage, (x) => dispatch(globalMessage(MessageActionType.Receive), x));

        SignalRConnect.on(ClientFunction.NewPoster, (x) => commit(globalPoster(PosterMutationType.Receive), x));

        SignalRConnect.on(ClientFunction.NewVote, (x) => dispatch(globalVote(VoteActionType.ReceiveNew), x));
        SignalRConnect.on(ClientFunction.VoteStatistics, (x) => dispatch(globalVote(VoteActionType.ReceiveStat), x));
    }
};


