import {ActionContext, ActionTree, MutationTree} from 'vuex';
import {RootStore} from '@/types/store';
import {Select} from '@/types/Types';
import Message from '@/models/Message';
import {INewMessageResponse} from '@/types/Responses';

export interface MessageStore {
    at: string | null;
    lastMessage: string | null;
    messages: Message[];
    selectMode: Select | null;
}

export enum MessageStateType {
    At = 'at',
    LastMessage = 'lastMessage',
    Messages = 'messages',
    SelectMode = 'selectMode'
}

export interface MessageMutations extends MutationTree<MessageStore> {
    receive: (state: MessageStore, message: Message) => void;
    setAt: (state: MessageStore, name: string | null) => void;
    setLastMessage: (state: MessageStore, message: string | null) => void;
    setSelectMode: (state: MessageStore, select: Select | null) => void;
    cleanup: (state: MessageStore) => void;
}

export enum MessageMutationType {
    Receive = 'receive',
    SetAt = 'setAt',
    SetLastMessage = 'setLastMessage',
    SetSelectMode = 'setSelectMode',
    Cleanup = 'cleanup'
}

export interface MessageActions extends ActionTree<MessageStore, RootStore> {
    receive: ({commit, dispatch, rootState}: ActionContext<MessageStore, RootStore>,
              response: INewMessageResponse) => void;
}

export enum MessageActionType {
    Receive = 'receive'
}

export function global(name: MessageMutationType | MessageActionType) {
    return `Message/${name}`;
}