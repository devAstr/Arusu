<template>
    <div :class="`poster-${dark ? 'dark' : 'light'}`" class="poster between p-1">
        <image-viewer :url="viewSelected" @close="viewSelected = null" v-if="viewSelected != null"></image-viewer>
        <div class="media-container mr-1" v-if="media != null">
            <img :src="media" @click="clickImage(media)" alt="Responsive image" class="media" v-if="isImage"/>
            <b-embed
                    :src="media"
                    :type="isYoutube ? 'iframe' : 'video'"
                    allowfullscreen
                    aspect="16by9"
                    class="media"
                    v-else>
            </b-embed>
        </div>
        <span :style="{width: media == null ? '100%' : '60%'}"
              class="text-left"
              style="max-height: 100%; flex-grow: 1; overflow-y: auto"
              v-html="contextHtml">
    </span>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, State, Vue} from 'nuxt-property-decorator';
    import {Media} from '@/types/Types';
    import ImageViewer from '@/components/modals/ImageViewer.vue';
    import Regex from '@/types/Regex';
    import HtmlHelper from '@/helpers/HtmlHelper';

    @Component({components: {ImageViewer}})
    export default class PosterBase extends Vue {
        @State dark!: boolean;
        @Prop({default: false}) staticPost!: boolean;
        @Prop({default: null}) media!: string | null;
        @Prop({default: null}) context!: string | null;
        viewSelected: string | null = null;

        get contextHtml(): string {
            return this.context != null ? HtmlHelper.markdown(this.context) : '';
        }

        get mediaType(): Media | null {
            try {
                if (this.media == null) {
                    return null;
                }
                if (Regex.image.test(this.media as string)) {
                    return Media.Image;
                }
                if (Regex.video.test(this.media as string)) {
                    return Media.Video;
                }
                if (Regex.youtubeEmbedRegex.test(this.media as string)) {
                    return Media.Youtube;
                }
                return null;
            } finally {
                Regex.image.lastIndex = 0;
                Regex.youtubeEmbedRegex.lastIndex = 0;
                Regex.video.lastIndex = 0;
            }
        }

        get isImage(): boolean {
            return this.mediaType === Media.Image;
        }

        get isVideo(): boolean {
            return this.mediaType === Media.Video;
        }

        get isYoutube(): boolean {
            return this.mediaType === Media.Youtube;
        }

        clickImage(uri: string) {
            if (this.staticPost) {
                this.viewSelected = uri;
            }
        }


    }
</script>

<style scoped>
    @import '@/assets/general.css';

    .poster {
        width: 100%;
        height: 12rem;
        border-radius: .25rem;
    }

    .poster-light {
        background-color: #f6f0e4;
    }

    .poster-dark {
        background-color: #8C3B3B;
    }

    .media-container {
        width: 12rem;
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
    }

    .media {
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
    }
</style>

<style>
    p {
        margin-bottom: 0.2rem;
    }
</style>
