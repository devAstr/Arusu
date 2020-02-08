<template>
    <loading v-if="loading"></loading>
</template>

<script lang="ts">
    import {Component, Vue} from 'nuxt-property-decorator';
    import * as Cookies from 'js-cookie';
    import axios from 'axios';
    import {ExternalLoginRequest} from '@/types/Requests';
    import {Cookie} from '@/types/Types';
    import Loading from '@/components/modals/Loading.vue';

    @Component({
        components: {Loading}
    })
    export default class Slash extends Vue {
        loading: boolean = false;

        created() {
            if (this.$route.params.hub === 'login') {
                this.loading = true;
                switch (this.$route.params.slash) {
                    case 'google':
                        this.google().then(() => {
                            window.close()
                        });
                        break;
                    case 'imgur':
                        this.imgur();
                        window.close();
                        return;
                    default:
                        window.close();
                        return;
                }
            } else if (!IsNullOrWhiteSpace(this.$route.params.slash)) {
                this.$router.replace(`/`);
            } else {
                this.$router.replace(`/${this.$route.params.hub}`);
            }
        }

        async google(): Promise<void> {
            let code = this.$route.query.code;
            if (typeof code != 'string') {
                return;
            }
            try {
                let response = await axios.post(`${process.env.server}/api/account`,
                    new ExternalLoginRequest(code),
                    {
                        headers: new Headers({
                            'Content-Type': 'text/json'
                        }),
                    }
                );
                Cookies.set(Cookie.AccessToken, response.data.code, {expires: 30});
            } catch (e) {
                console.log(e);
            }
        }

        imgur() {
            let token = this.$route.hash.match(/access_token=(\w+)/);
            if (token != null) {
                Cookies.set(Cookie.Imgur, token[1], {expires: 30});
            }
        }
    }
</script>