import {MediaActions, MediaMutations, MediaMutationType, MediaStore} from '@/types/store/Media';
import Media from '@/models/Media';
import {ActionContext} from '@/node_modules/vuex';
import {RootStore} from '@/types/store';

export const state: () => MediaStore = () => <MediaStore>{
    medias: []
};

export const mutations: MediaMutations = <MediaMutations>{
    add(state: MediaStore, media: Media) {
        state.medias.unshift(media);
    },

    remove(state: MediaStore, media: Media) {
        let index = state.medias.indexOf(media);
        if (index >= 0) {
            state.medias.splice(index, 1);
        }
    },

    cleanup(state: MediaStore) {
        state.medias = [];
    }
};


export const actions: MediaActions = <MediaActions>{
    removeByOwner({commit, state}: ActionContext<MediaStore, RootStore>, item: { userId: string, uri: string }) {
        state.medias
            .filter((x: Media) => x.uri === item.uri && x.userId === item.userId)
            .forEach((x: Media) => commit(MediaMutationType.Remove, x))
    },

    removeByAdmin({commit, state}: ActionContext<MediaStore, RootStore>, uri: string) {
        state.medias.filter((x: Media) => x.uri === uri).forEach((x: Media) => commit(MediaMutationType.Remove, x))
    },
};
