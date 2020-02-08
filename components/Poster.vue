<template>
    <div v-if="available">
        <create-poster-vote @close="openEditor = false" v-if="openEditor">
        </create-poster-vote>
        <div class="mt-1 mb-2 between d-flex">
            <h5 class="mb-0">海報</h5>
            <div class="center">
                <input @click="openEditor = true"
                       class="icon d-none d-md-inline mr-2"
                       src="@/assets/poster.png"
                       type="image"/>
                <b-form-select :class="{'input-dark': dark}" :options="options" v-model="displaySelect"/>
            </div>
        </div>
        <poster-base :class="{'d-none': isHide}" :context="context" :media="media" :static-post="true" class="mb-4">
        </poster-base>
    </div>
</template>

<script lang="ts">
    import {Component, mixins, namespace} from 'nuxt-property-decorator';
    import {MediaDisplay} from '@/types/Types';
    import PosterBase from '@/components/scaffolding/PosterBase.vue';
    import HubBase from '@/components/scaffolding/HubBase';
    import {PosterStateType} from '@/types/store/Poster';
    import CreatePosterVote from '@/components/modals/CreatePosterVote.vue';

    const PosterStore = namespace('Poster');
    @Component({components: {CreatePosterVote, HubBase, PosterBase}})
    export default class Poster extends mixins(HubBase) {
        @PosterStore.State(PosterStateType.Media) media!: string | null;
        @PosterStore.State(PosterStateType.Context) context!: string | null;
        // @PosterStore.State time!: number | null;
        displaySelect: MediaDisplay = MediaDisplay.Normal;
        openEditor: boolean = false;
        options: { value: MediaDisplay, text: any }[] = [
            {value: MediaDisplay.Normal, text: '顯示'},
            {value: MediaDisplay.Hide, text: '隱藏'}
        ];

        get available(): boolean {
            return !IsNullOrWhiteSpace(this.context);
        }

        get isHide(): boolean {
            return this.displaySelect === MediaDisplay.Hide;
        }
    }
</script>

<style scoped>
    @import "@/assets/general.css";
</style>
