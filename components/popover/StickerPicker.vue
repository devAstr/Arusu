<template>
    <div :class="{'text-white': dark}" class="m-2">
        <b-card :bg-variant="dark ? 'dark' : ''" ext-variant="white" no-body>
            <b-nav card-header slot="header" tabs v-b-scrollspy:sticker-list>
                <b-nav-item :href="`#${value.title}`"
                            :key="value.title"
                            @click="scrollIntoView"
                            v-for="value in emojiList">
                    {{value.title}}
                </b-nav-item>
            </b-nav>
            <b-card-body
                    class="sticker-list p-2"
                    id="sticker-list"
                    ref="content">
                <div v-for="value in emojiList">
                    <div :id="value.title" class="mb-1 pt-2 h6">{{value.title}}</div>
                    <div class="around flex-wrap">
                        <input :src="`${server}/emoji/${emoji}.png`"
                               @click="onSelected(emoji)"
                               class="emoji m-2 m-md-1"
                               type="image"
                               v-for="emoji in value.emoji"/>
                    </div>
                </div>
            </b-card-body>
        </b-card>
    </div>
</template>

<script lang="ts">
    import {Component, mixins} from 'nuxt-property-decorator';
    import * as Cookies from 'js-cookie';
    import {BCard, BCardBody, VBScrollspy} from 'bootstrap-vue'
    import Emoji from '@/models/Emoji';
    import HubBase from '@/components/scaffolding/HubBase';

    @Component({components: {BCard, BCardBody, HubBase}, directives: {'b-scrollspy': VBScrollspy}})
    export default class StickerPicker extends mixins(HubBase) {
        server: string = process.env.server as string;
        emojiHistory: string[] = [];

        get emojiList(): { title: string, emoji: string[] }[] {
            let result = Emoji.Catalog;
            if (this.emojiHistory.length > 0) {
                result.unshift({title: '紀錄', emoji: this.emojiHistory});
            }

            return result;
        }

        created() {
            this.emojiHistory = Cookies.getJSON('stickerHistory') ?? [];
        }

        onSelected(emoji: string) {
            this.$emit('attach', emoji);

            if (!this.emojiHistory.includes(emoji)) {
                this.emojiHistory.unshift(emoji);
                if (this.emojiHistory.length > 10) {
                    this.emojiHistory = this.emojiHistory.slice(0, 10);
                }
            }
            Cookies.set('stickerHistory', this.emojiHistory, {expires: 3650});

            this.$emit('close', true);
        }

        scrollIntoView(evt: MouseEvent) {
            evt.preventDefault();
            const href = (evt.target as HTMLElement).getAttribute('href');
            if (href == null) {
                return;
            }

            const el = document.querySelector(href) as HTMLElement;
            if (el != null) {
                (this.$refs.content as HTMLDivElement).scrollTop = el.offsetTop;
            }
        }
    }
</script>

<style scoped>
    @import '@/assets/general.css';
    @import '@/assets/emoji.css';

    a.nav-link {
        color: inherit;
    }

    .sticker-list {
        position: relative;
        max-width: 100%;
        max-height: 12rem;
        overflow-y: scroll;
    }
</style>
