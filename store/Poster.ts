import {INewPosterResponse} from '@/types/Responses';
import {PosterMutations, PosterStore} from '@/types/store/Poster';
import TimeHelper from '@/helpers/TimeHelper';

export const state: () => PosterStore = () => <PosterStore>{
    media: null,
    context: null,
    time: null,
};

export const mutations: PosterMutations = <PosterMutations>{
    receive(state: PosterStore, response: INewPosterResponse): void {
        state.media = response.poster.media;
        state.context = response.poster.context;
        state.time = TimeHelper.ConvertToTimeString(response.poster.time);
    },

    cleanup(state: PosterStore): void {
        state.media = null;
        state.context = null;
        state.time = null;
    }
};
