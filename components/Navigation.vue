<template>
    <div>
        <help @close="help = false" v-if="help"/>
        <vote-history @close="history = false" v-if="history"/>
        <b-navbar :type="dark ? 'dark' : 'light'" :variant="dark ? 'dark' : 'light'" class="mb-2" toggleable="md">
            <b-navbar-brand class="online center">
                <div>{{onlineUser}}</div>
            </b-navbar-brand>

            <b-navbar-brand class="room center">
                <div class="d-none d-sm-inline">
                    <nuxt-link to="/">{{site}}</nuxt-link>/<div class="d-inline">{{hub}}</div>
                </div>
                <nuxt-link class="d-inline d-sm-none" to="/">{{hub}}</nuxt-link>
            </b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"/>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-navbar-brand class="pneuma mt-2 mt-sm-0 center">
                        <div :class="pneumaClass">
                            {{pneumaDescription}}
                        </div>
                    </b-navbar-brand>
                    <b-nav-item @click="login" href="#" id="login-btn" target="_blank" v-if="!logged">登入</b-nav-item>
                    <b-nav-item-dropdown text="商店" v-if="logged">
                        <b-dropdown-item :disabled="!canBuyItem" @click="changeColor">
                            更換顏色{{canBuyItem ? '' : ' (Sync 不足)'}}
                        </b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item @click="history = true" href="#">歷史投票</b-nav-item>
                </b-navbar-nav>
                <b-navbar-nav class="ml-auto">
                    <b-nav-item-dropdown class="mr-2" right text="選項">
                        <b-dropdown-item @click="prepareDark(!dark)" href="#">
                            {{dark ? "關閉" : "開啟"}}暗色模式
                        </b-dropdown-item>
                        <b-dropdown-item @click="setOpenMedia(!openMedia)" href="#" v-if="logged">
                            {{openMedia ? "關閉" : "開啟"}}媒體功能
                        </b-dropdown-item>
                        <b-dropdown-item @click="logoutImgur()" href="#" v-if="imgurLogged">
                            登出 Imgur
                        </b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item @click="help = true" class="mr-2" href="#">幫助</b-nav-item>
                    <b-nav-item @click="logout" href="#" id="logout-btn" v-if="logged">登出</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script lang='ts'>
    import {Component, Getter, mixins, Mutation, State} from 'nuxt-property-decorator';
    import {BCollapse, BDropdownItem, BNavbar, BNavbarBrand, BNavbarNav, BNavbarToggle} from 'bootstrap-vue'
    import * as Cookies from 'js-cookie';
    import Help from '@/components/modals/Help.vue';
    import {Cookie} from '@/types/Types';
    import {RootGetterType, RootMutationType, RootStateType} from '@/types/store';
    import HubBase from '@/components/scaffolding/HubBase';
    import Vote from '@/components/Vote.vue';
    import VoteHistory from '@/components/modals/VoteHistory.vue';
    import axios from 'axios';
    import {INotificationResponse} from "@/types/Responses";

    @Component({
        components: {
            BCollapse,
            BDropdownItem,
            BNavbar,
            BNavbarBrand,
            BNavbarNav,
            BNavbarToggle,
            Help,
            HubBase,
            VoteHistory,
            Vote
        }
    })
    export default class Navigation extends mixins(HubBase) {
        @State(RootStateType.OnlineUser) onlineUser!: number;
        @State(RootStateType.Pneuma) pneuma!: number;
        @State(RootStateType.Restriction) restriction!: number;
        @State(RootStateType.Freeze) freeze!: number;
        @State(RootStateType.OpenMedia) openMedia!: boolean;
        @Getter(RootGetterType.CanBuyItem) canBuyItem!: boolean;
        @Getter(RootGetterType.Logged) logged!: number;
        @Mutation(RootMutationType.SetDark) setDark!: (x: boolean) => void;
        @Mutation(RootMutationType.SetOpenMedia) setOpenMedia!: (x: boolean) => void;
        @Mutation(RootMutationType.SetLoading) setLoading!: (x: boolean) => void;
        @Mutation(RootMutationType.SetOtherError) setError!: (x: string) => void;
        @Mutation(RootMutationType.SetNotification) setNotification!: (x: INotificationResponse) => void;
        help: boolean = false;
        history: boolean = false;
        site: string = process.env.site as string;

        get loginUri(): string {
            return 'https://accounts.google.com/o/oauth2/v2/auth?' +
                `redirect_uri=${encodeURI(process.env.base_uri as string)}/login/google&` +
                'prompt=consent&' +
                'response_type=code&' +
                `client_id=${process.env.google_client_id}&` +
                'scope=openid';
        }

        get imgurLogged(): boolean {
            return Cookies.get(Cookie.Imgur) != null;
        }

        get pneumaClass() {
            if (this.pneuma == null) {
                return null;
            }

            if (this.pneuma >= this.restriction) {
                return {'text-success': true};
            }

            if (this.pneuma > this.freeze) {
                return {'text-primary': true};
            }

            return {'text-danger': true};
        }

        get pneumaDescription(): string {
            if (this.pneuma != null) {
                let base = `Pneuma sync: ${this.pneuma}`;
                return this.restriction == null
                    ? base
                    : `${base} ${this.pneuma < this.restriction ? '<' : '>'} ${this.restriction}`;

            }

            if (this.freeze != null) {
                return '禁止發言';
            }
            if (this.restriction != null) {
                return '發言受限';
            }

            return '自由模式';
        }

        prepareDark(x: boolean) {
            this.setDark(x);
        }

        changeColor() {
            let token = Cookies.get(Cookie.AccessToken);
            if (IsNullOrWhiteSpace(token)) {
                throw new Error();
            }

            axios.post(`${process.env.server}/api/store/color`, null, {headers: {Authorization: `Bearer ${token}`}})
                .then(response => {
                    this.setNotification(<INotificationResponse>{
                        title: '顏色變更',
                        message: response.data.Color
                    })
                });
        }

        logout() {
            Cookies.remove(Cookie.AccessToken);
            Cookies.remove(Cookie.Imgur);
        }

        logoutImgur() {
            Cookies.remove(Cookie.Imgur);
        }

        login() {
            window.open(this.loginUri);
        }
    }
</script>

<style scoped>
    @import "@/assets/general.css";

    .online {
        width: 4rem;
        height: 4rem;
        background: #42b983;
        align-items: center;
    }

    .room {
        font-size: 1.5rem;
    }

    .pneuma {
        font-size: 1rem;
        align-items: center;
    }
</style>
