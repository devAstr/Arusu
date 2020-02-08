import {ActionPermission, Media as MediaType} from '@/types/Types';

export default class Media {
    readonly id: number;
    readonly userId: string;
    readonly name: string;
    readonly color: string;
    readonly uri: string;
    readonly time: string;
    readonly type: MediaType;
    private readonly _permission: ActionPermission | null;

    constructor(identifier: string,
                userName: string,
                userColor: string,
                uri: string,
                time: string,
                type: MediaType,
                permission: ActionPermission | null) {
        this.id = Date.now() + Math.random();
        this.userId = identifier;
        this.name = userName;
        this.color = userColor;
        this.uri = uri;
        this.time = time;
        this.type = type;
        this._permission = permission;
    }

    get darkColor(): string {
        return this._permission != ActionPermission.Admin ? this.color.toDarkColor() : this.color;
    }

    get isImage(): boolean {
        return this.type === MediaType.Image;
    }

    get isVideo(): boolean {
        return this.type === MediaType.Video;
    }

    get isYoutube(): boolean {
        return this.type === MediaType.Youtube;
    }
}
