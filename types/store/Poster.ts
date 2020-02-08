import {MutationTree} from 'vuex';
import {INewPosterResponse} from '@/types/Responses';

export interface PosterStore {
    media: string | null,
    context: string | null,
    time: string | null,
}

export enum PosterStateType {
    Media = 'media',
    Context = 'context',
    Time = 'time'
}

export interface PosterMutations extends MutationTree<PosterStore> {
    receive: (state: PosterStore, response: INewPosterResponse) => void;
    cleanup: (state: PosterStore) => void;
}

export enum PosterMutationType {
    Receive = 'receive',
    Cleanup = 'cleanup',
}

export function global(name: PosterMutationType) {
    return `Poster/${name}`;
}