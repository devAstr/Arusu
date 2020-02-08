<template>
    <div :class="{'text-light': dark}" class="container">
        <div class="d-block d-flex justify-content-center align-items-center mt-2 mt-md-5 mb-4">
            <div>
                <input :class="{'input-dark': dark}"
                       @keypress.enter="go"
                       class="form-control form-control-lg mr-2"
                       maxlength="16"
                       placeholder="前往看板..."
                       style="width: 16rem"
                       v-model="hub">
            </div>
            <div>
                <button :disabled="!valid"
                        @click="go"
                        class="btn btn-lg btn-primary ml-2"
                        style="width: 4rem"
                        type="button">
                    Go
                </button>
            </div>
        </div>
        <div class="d-block d-flex justify-content-center align-items-center my-3 mt-sm-5" style="font-size: 2rem">
            <div class="online d-inline d-flex justify-content-center align-items-center mr-2">{{total}}</div>
            <div class="d-inline ml-2">熱門看板</div>
        </div>
        <div class="d-flex flex-wrap justify-content-around">
            <nuxt-link :class="{dark: dark}"
                       :key="hub.hub"
                       :to="`/${hub.hub}`"
                       class="hub mx-1 mx-sm-3 my-2 p-4 card d-flex flex-column flex-sm-row  justify-content-start"
                       v-for="hub in hubs">
                <div class="online d-flex justify-content-center align-items-center ">
                    <div>{{hub.online}}</div>
                </div>
                <div class="flex-grow-1 mx-2 mt-2 mt-sm-0" style="font-size: 1.6rem">{{hub.hub}}</div>
            </nuxt-link>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Mutation, State, Vue, Watch} from 'nuxt-property-decorator';
    import axios from 'axios';
    import * as Cookies from 'js-cookie';
    import {RootMutationType, RootStateType} from '@/types/store';
    import {Cookie} from '@/types/Types';

    @Component
    export default class Index extends Vue {
        @State(RootStateType.Dark) dark!: boolean;
        @Mutation(RootMutationType.SetDark) setDark!: (x: boolean) => void;
        server: string = process.env.server as string;
        total: number = 0;
        hubs: { hub: string, online: number }[] | null = null;
        hub: string = '';

        get valid(): boolean {
            return !IsNullOrWhiteSpace(this.hub) && this.hub.length <= 16;
        }

        @Watch('dark', {immediate: true})
        onDArkChange(val: Boolean) {
            let bodyStyles = document.body.style;
            if (val) {
                bodyStyles.setProperty('background-color', 'black');
            } else {
                bodyStyles.removeProperty('background-color');
            }
        }

        beforeMount() {
            if (!IsNullOrWhiteSpace(this.$route.hash)) {
                let token = this.$route.hash.match(/access_token=(\w+)/);
                if (token != null) {
                    Cookies.set(Cookie.Imgur, token[1], {expires: 30});
                    window.close();
                }
            }
            this.setDark(Cookies.get(Cookie.Dark) === true.toString());
        }

        go() {
            if (!this.valid) {
                return;
            }
            this.$router.push(this.hub);
        }

        created() {
            axios.get(`${this.server}/api/hub`)
                .then(response => {
                    this.total = response.data.total;
                    this.hubs = response.data.populars;
                }).catch(error => console.log(error));
        }
    }
</script>

<style>
    @import "@/assets/input.css";

    .container {
        margin: 0 auto;
        min-height: 100vh;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .hub {
        width: 45%;
        align-items: center;
        text-align: center;
        flex-direction: row;
    }

    .online {
        width: 4rem;
        height: 4rem;
        background: #42b983;
        font-size: 1.2rem;
    }

    .dark {
        background-color: #1c1c1e;
    }

    a.hub {
        color: inherit;
        text-decoration: none;
    }

    a.hub:hover {
        color: inherit;
    }
</style>
