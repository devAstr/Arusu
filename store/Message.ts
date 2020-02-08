import {ActionContext} from 'vuex';
import {MessageActions, MessageMutations, MessageMutationType, MessageStore} from '@/types/store/Message';
import {RootStore} from '@/types/store';
import {ActionPermission, Command, Select} from '@/types/Types';
import Message from '@/models/Message';
import {INewMessageResponse} from '@/types/Responses';
import Media from '@/models/Media';
import {global, MediaActionType, MediaMutationType} from '@/types/store/Media';

export const state: () => MessageStore = () => <MessageStore>{
    at: null,
    lastMessage: null,
    messages: [],
    selectMode: null
};

export const mutations: MessageMutations = <MessageMutations>{
    receive(state: MessageStore, message: Message): void {
        state.messages.splice(0, 0, message);
        if (state.messages.length > 100) {
            state.messages = state.messages.slice(0, 100);
        }
    },

    setAt(state: MessageStore, name: string) {
        state.at = name;
    },
    setLastMessage(state: MessageStore, message: string | null): void {
        state.lastMessage = message;
    },
    setSelectMode(state: MessageStore, select: Select | null = null): void {
        state.selectMode = select;
    },

    cleanup(state: MessageStore): void {
        state.messages = [];
        state.selectMode = null;
    }
};

export const actions: MessageActions = <MessageActions>{
    receive({commit, dispatch, rootState}: ActionContext<MessageStore, RootStore>, response: INewMessageResponse) {
        let message: Message = new Message(response);
        if (response.message.startsWith(Command.DeleteMedia)) {
            message.media.forEach((x: Media) => {
                dispatch(global(
                    response.permission === ActionPermission.Admin
                        ? MediaActionType.RemoveByAdmin
                        : MediaActionType.RemoveByOwner),
                    {userId: message.userId, uri: x.uri}, {root: true}
                );
            });
        } else if (response.permission !== ActionPermission.NoMedia) {
            message.media.forEach((x: Media) => {
                commit(global(MediaMutationType.Add), x, {root: true})
            });
        }

        commit(MessageMutationType.Receive, message);
        commit(MessageMutationType.SetLastMessage, response.message, {root: true});
    },
};
