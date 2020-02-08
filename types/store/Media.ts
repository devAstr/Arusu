import {ActionContext, ActionTree, MutationTree} from 'vuex';
import Media from '@/models/Media';
import {RootStore} from '@/types/store';

export interface MediaStore {
    medias: Media[];
}

export enum MediaStateType {
    Medias = 'medias'
}

export interface MediaMutations extends MutationTree<MediaStore> {
    add: (state: MediaStore, media: Media) => void;
    remove: (state: MediaStore, media: Media) => void;
    cleanup: (state: MediaStore) => void;
}

export enum MediaMutationType {
    Add = 'add',
    Remove = 'remove',
    Cleanup = 'cleanup'
}

export interface MediaActions extends ActionTree<MediaStore, RootStore> {
    removeByOwner: ({commit}: ActionContext<MediaStore, RootStore>, item: { userId: string, uri: string }) => void;
    removeByAdmin: ({commit}: ActionContext<MediaStore, RootStore>, uri: string) => void;
}

export enum MediaActionType {
    RemoveByOwner = 'removeByOwner',
    RemoveByAdmin = 'removeByAdmin'
}

export function global(name: MediaMutationType | MediaActionType) {
    return `Media/${name}`;
}