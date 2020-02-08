<template>
    <div v-if="logged && openMedia">
        <image-viewer :url="viewSelected" @close="viewSelected = null" v-if="viewSelected != null"/>
        <report :media="reportSelected" @close="reportSelected = null" v-if="reportSelected != null"/>
        <create-poster-vote :media="posterSelected" @close="posterSelected = null" v-if="posterSelected != null">
        </create-poster-vote>
        <div class="between mb-2">
            <h5 class="mb-0">媒體區</h5>
            <div>
                <b-form-select :class="{'input-dark': dark}" :options="options" v-model="displaySelect"/>
            </div>
        </div>
        <div :class="{invisible: isHide}">
            <div :key="source.id" v-for="source in medias">
                <div class="mt-2">
                    <div :class="`media-bar-${dark ? 'dark' : 'light'}`" class="media-bar between rounded-top">
                        <button @click="hide(source)" aria-label="Close" class="close" type="button">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div :style="{color: dark ? source.color.toDarkColor() : source.color}"
                             class="flex-grow-1 text-left mx-2">
                            {{source.name}}
                            <div class="time d-inline mr-1">{{source.time}}</div>
                        </div>
                        <input @click="restoreMask(source.id)"
                               class="icon mr-2"
                               src="@/assets/mask.png"
                               type="image" v-if="closedMask[source.id]"/>
                        <input @click="posterSelected = source"
                               class="icon d-none d-md-inline mr-2"
                               src="@/assets/poster.png"
                               type="image"/>
                        <input @click="reportSelected = source" class="icon" src="@/assets/report.png" type="image"/>
                    </div>
                    <div style="position: relative">
                        <div :class="`media-mask-${dark ? 'dark' : 'light'}`"
                             @click="closeMask(source.id)"
                             class="mask"
                             v-if="x > 0 && isMask && !closedMask[source.id]">
                        </div>
                        <div v-if="source.isImage">
                            <img :src="source.uri" @click="viewSelected=source.uri" class="img-fluid">
                        </div>
                        <div v-else>
                            <b-embed
                                    :src="source.uri"
                                    :type="source.isYoutube ? 'iframe' : 'video'"
                                    allowfullscreen
                                    aspect="16by9"
                                    controls>
                            </b-embed>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Component, Getter, mixins, namespace, State, Watch} from 'nuxt-property-decorator';
    import ImageViewer from '@/components/modals/ImageViewer.vue';
    import CreatePosterVote from '@/components/modals/CreatePosterVote.vue';
    import Report from '@/components/modals/Report.vue';
    import {MediaDisplay, ServerFunction} from '@/types/Types';
    import {NewMessageRequest} from '@/types/Requests';
    import Media from '@/models/Media';
    import HubBase from '@/components/scaffolding/HubBase';
    import {RootGetterType, RootStateType} from '@/types/store';
    import {MediaMutationType, MediaStateType} from '@/types/store/Media';

    const MediaStore = namespace('Media');

    @Component({components: {CreatePosterVote, HubBase, ImageViewer, Report}})
    export default class MediaList extends mixins(HubBase) {
        @State(RootStateType.Id) id!: string;
        @State(RootStateType.Name) name!: string;
        @State(RootStateType.OpenMedia) openMedia!: boolean;
        @Getter(RootGetterType.Logged) logged!: boolean;
        @MediaStore.State(MediaStateType.Medias) medias!: Media[];
        @MediaStore.Mutation(MediaMutationType.Remove) remove !: (x: Media) => void;

        server: string = process.env.server as string;
        posterSelected: Media | null = null;
        reportSelected: Media | null = null;
        displaySelect: MediaDisplay = MediaDisplay.Normal;
        viewSelected: string | null = null;
        options: { value: MediaDisplay, text: any }[] = [
            {value: MediaDisplay.Normal, text: '顯示'},
            {value: MediaDisplay.Mask, text: '遮罩'},
            {value: MediaDisplay.Hide, text: '隱藏'}
        ];
        closedMask: { [key: string]: boolean } = {};
        x: number = 1;

        get isHide(): boolean {
            return this.displaySelect === MediaDisplay.Hide;
        }

        get isMask(): boolean {
            return this.displaySelect === MediaDisplay.Mask;
        }

        @Watch('displaySelect')
        onDisplayChange() {
            this.closedMask = {};
        }

        closeMask(id: string) {
            this.closedMask[id] = true;
            this.x += 1;
        }

        restoreMask(id: string) {
            this.closedMask[id] = false;
            this.x += 1;
        }

        hide(item: Media) {
            if (item.userId === this.id) {
                SignalRConnect.send(ServerFunction.NewMessage,
                    new NewMessageRequest(this.hub, this.name, `/delete ${item.uri}`));
            }

            this.remove(item);
        }
    }
</script>

<style scoped>
    @import '@/assets/general.css';
    @import '@/assets/input.css';

    .media-bar {
        height: 2rem;
    }

    .media-bar-light {
        background-color: #eaf6e5;
    }

    .media-bar-dark {
        background-color: #023440;
    }

    .time {
        font-size: 0.75rem;
        color: #888;
    }

    .mask {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
    }

    .media-mask-light {
        background-color: #000000f2;
    }

    .media-mask-dark {
        background-color: #fffffff2;
    }
</style>
