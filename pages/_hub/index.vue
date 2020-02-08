<template>
    <div :class="{'text-white': dark}" id="hub">
        <loading v-if="loading"></loading>
        <announcement @close="setAnnouncement(null)" v-if="announcement != null">
            <template v-slot:title>
                {{announcement.title}}
            </template>
            <span v-html="announcement.message"></span>
        </announcement>
        <navigation></navigation>
        <div class="container-fluid d-sm-flex">
            <div class="d-block d-sm-none mb-2">
                <poster class="mb-2"></poster>
                <vote></vote>
            </div>
            <div class="d-flex w-100 overflow-auto">
                <div class="flex-grow-1 mr-2" style="min-width: 22rem; max-width: 60%">
                    <console></console>
                    <message-list></message-list>
                </div>
                <div style="width: 40%; min-width: 16.8rem">
                    <div class="d-none d-sm-block">
                        <poster class="mb-2"></poster>
                        <vote class="mb-2"></vote>
                    </div>
                    <media-list style="min-width: 16rem"></media-list>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Action, Component, mixins, Mutation, State, Watch} from 'nuxt-property-decorator';
    import {MetaInfo} from 'vue-meta';
    import * as Cookies from 'js-cookie';
    import HubBase from '@/components/scaffolding/HubBase';
    import {IAnnouncementResponse, INotificationResponse} from '@/types/Responses';
    import {RootActionType, RootMutationType, RootStateType} from '@/types/store';
    import {HttpTransportType, HubConnectionBuilder} from '@/node_modules/@aspnet/signalr';
    import {Cookie, ServerFunction} from '@/types/Types';
    import {JoinHubRequest} from '@/types/Requests';
    import Loading from '@/components/modals/Loading.vue'
    import Announcement from '@/components/modals/Announcement.vue';
    import Navigation from '@/components/Navigation.vue';
    import Poster from '@/components/Poster.vue';
    import Vote from '@/components/Vote.vue';
    import Console from '@/components/Console.vue';
    import MessageList from '@/components/MessageList.vue';
    import MediaList from '@/components/MediaList.vue';

    @Component({components: {MediaList, MessageList, Console, Vote, Poster, Navigation, Announcement, Loading}})
    export default class Index extends mixins(HubBase) {
        @State(RootStateType.Dark) dark!: boolean;
        @State(RootStateType.Loading) loading!: boolean;
        @State(RootStateType.LastMessage) lastMessage!: string | null;
        @State(RootStateType.Notification) notification!: string | null;
        @State(RootStateType.Announcement) announcement!: IAnnouncementResponse | null;
        @Mutation(RootMutationType.SetDark) setDark!: (x: boolean) => void;
        @Mutation(RootMutationType.SetBlur) setBlur!: (x: boolean) => void;
        @Mutation(RootMutationType.SetLastMessage) setLastMessage!: (x: string | null) => void;
        @Mutation(RootMutationType.SetAnnouncement) setAnnouncement!: (x: IAnnouncementResponse | null) => void;
        @Mutation(RootMutationType.SetOpenMedia) setOpenMedia!: (x: boolean) => void;
        @Mutation(RootMutationType.SetOpenPoster) setOpenPoster!: (x: boolean) => void;
        @Mutation(RootMutationType.SetOpenVote) setOpenVote!: (x: boolean) => void;
        @Mutation(RootMutationType.SetLoading) setLoading!: (x: boolean) => void;
        @Mutation(RootMutationType.SetName) setName!: (x: string) => void;
        @Mutation(RootMutationType.SetDisconnectState) setDisconnectState!: (x: boolean) => void;
        @Action setResponseProcessor!: () => void;
        @Action(RootActionType.Cleanup) cleanup!: () => void;
        // @MessageStore.Mutation('cleanup') messageCleanup!: () => void;
        // @MediaStore.Mutation('cleanup') mediaCleanup!: () => void;
        // @PosterStore.Mutation('cleanup') posterCleanup!: () => void;
        // @VoteStore.Mutation('cleanup') voteCleanup!: () => void;
        access: string | null = null;
        timer: any = null;
        titleToggle: boolean = false;

        get title(): string {
            return this.titleToggle && !IsNullOrWhiteSpace(this.lastMessage) ? this.lastMessage as string : this.hub;
        }

        @Watch('notification')
        onNotification(val: INotificationResponse | null) {
            if (val != null && !IsNullOrWhiteSpace(val.message)) {
                this.$bvToast.toast(val.message, {
                    title: val.title,
                    autoHideDelay: 3000,
                    headerClass: this.dark ? 'toast-header-dark' : '',
                    bodyClass: this.dark ? 'toast-body-dark' : '',
                    noCloseButton: true
                })
            }
        }

        @Watch('dark', {immediate: true})
        onDarkChange(val: Boolean) {
            let bodyStyles = document.body.style;
            if (val) {
                bodyStyles.setProperty('background-color', 'black');
            } else {
                bodyStyles.removeProperty('background-color');
            }
        }

        created() {
            this.setLoading(true);
            if (this.hub.length > 16) {
                this.$router.replace('/');
                return;
            }
            this.$router.replace(this.hub.toLowerCase());

            let version = Cookies.get(Cookie.Version);
            if (typeof version !== 'string' || parseInt(version) < parseInt(process.env.version as string)) {
                Cookies.remove(Cookie.AccessToken);
            }

            Cookies.set(Cookie.Version, process.env.version!.toString(), {expires: 3650});
            this.setOpenMedia(Cookies.get(Cookie.OpenMedia) === true.toString());
            this.setOpenPoster(Cookies.get(Cookie.OpenPoster) === true.toString());
            this.setOpenVote(Cookies.get(Cookie.OpenVote) === true.toString());
            this.setDark(Cookies.get(Cookie.Dark) === true.toString());

            let name = Cookies.get(Cookie.Name) as string | null;
            if (IsNullOrWhiteSpace(name)) {
                name = `Unknown#${Math.round(Math.random() * 100000)}`;
                Cookies.set(Cookie.Name, name as string, {expires: 3650});
            }

            this.setName(name as string);
            this.access = Cookies.get(Cookie.AccessToken) ?? '';
            this.$global.SignalRConnect = new HubConnectionBuilder()
                .withUrl(`${process.env.server}/api/hub/connect`, {
                    accessTokenFactory: () => IsNullOrWhiteSpace(this.access) ? '' : this.access as string,
                    transport: HttpTransportType.WebSockets,
                })
                .build();

            SignalRConnect.serverTimeoutInMilliseconds = 60000;
            SignalRConnect.keepAliveIntervalInMilliseconds = 10000;

            SignalRConnect.start().then(() => {
                this.setDisconnectState(false);
                this.setResponseProcessor();
                SignalRConnect.send(ServerFunction.JoinHub, new JoinHubRequest(this.hub, name as string))
            }).catch(err => {
                console.log(err);
                this.setDisconnectState(true);
            });

            SignalRConnect.onclose(error => {
                console.log(error);
                this.setDisconnectState(true);
            });

            window.addEventListener('blur', this.setTimer);
            window.addEventListener('focus', this.removeTimer);
            window.addEventListener('focus', this.checkLogin);
        }

        beforeDestroy() {
            SignalRConnect.stop();
            window.removeEventListener('blur', this.setTimer);
            window.removeEventListener('focus', this.removeTimer);
            window.removeEventListener('focus', this.checkLogin);
            this.cleanup();
        }

        setTimer() {
            this.setBlur(true);
            this.timer = setInterval(() => this.titleToggle = !this.titleToggle, 1000);
        }

        removeTimer() {
            this.setBlur(false);
            clearInterval(this.timer);
            this.timer = null;
            this.setLastMessage(null);
        }

        checkLogin() {
            let access = Cookies.get(Cookie.AccessToken) ?? '';
            if (access !== this.access) {
                location.reload();
            }
        }

        head() {
            return <MetaInfo>{
                title: this.title,
            }
        }
    }
</script>

<style scoped>

</style>