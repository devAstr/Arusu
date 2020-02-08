import {HubConnection} from '@aspnet/signalr';

declare module 'vue/types/vue' {
    export interface Vue {
        // $bvToast: any;
        $global: any;
    }
}

declare global {
    let SignalRConnect: HubConnection;

    function IsNullOrWhiteSpace(str: any): boolean;

    interface String {
        format(this: string, ...params: string[]): string;

        // replaceAll(this: string, search: RegExp | string, replacement: string): string;

        toRegExpString(this: string): string;

        toDarkColor(this: string): string;
    }

    interface DataTransferItemList {
        find(this: DataTransferItemList, func: (x: DataTransferItem) => boolean): DataTransferItem | null;
    }

    interface Array<T> {
        Distinct<T>(this: Array<T>): Array<T>;
    }
}