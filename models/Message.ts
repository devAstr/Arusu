import {INewMessageResponse} from '@/types/Responses';
import {ActionPermission, Media as MediaType} from '@/types/Types';
import Media from '@/models/Media';
import TimeHelper from '@/helpers/TimeHelper';
import HtmlHelper from '@/helpers/HtmlHelper';
import Regex from '@/types/Regex';
import Emoji from '@/models/Emoji';

export default class Message {
    private static tagA: string = '<a href="{0}" target="_blank">{1}\</a>';
    private static tagImage: string = `<img class='emoji' src='${process.env.server}\\emoji\\{0}.png' alt='{0}'>`;
    readonly userId: string;
    readonly name: string;
    readonly color: string;
    readonly message: string;
    readonly time: string;
    readonly media: Media[];
    readonly permission: ActionPermission | null;

    constructor(response: INewMessageResponse) {
        this.userId = response.userId;

        this.name = response.name;
        this.color = response.color;
        this.time = TimeHelper.ConvertToTimeString(response.time);
        this.media = [];
        this.permission = response.permission;

        let message = HtmlHelper.Encode(response.message);
        if (response.permission != ActionPermission.NoMedia) {
            [...message.matchAll(Regex.url)]
                .map(x => x[1])
                .Distinct()
                .forEach((x: string) => {
                    let original = HtmlHelper.Decode(x);
                    if (original!.length > 32) {
                        original = `${original!.substr(0, 14)}...${original!.substr(original!.length - 8, 8)}`;
                    }

                    message = message.replace(new RegExp(`https?://${x.toRegExpString()}`, 'g'),
                        Message.tagA.format(`https://${HtmlHelper.Decode(x)}`, `https://${original}`)
                    );
                });
            Regex.url.lastIndex = 0;

            this.FindMedia(response.message, Regex.image, MediaType.Image);
            this.FindMedia(response.message, Regex.video, MediaType.Video);
            this.FindY2(response.message);

        }

        [...message.matchAll(Regex.emj)]
            .map(x => x[0])
            .Distinct()
            .forEach((x: string) => {
                if (Emoji.All.map((_x) => _x.name).includes(x)) {
                    message = message.replace(new RegExp(x.toRegExpString(), 'g'), Message.tagImage.format(x));
                }
            });

        this.message = message;
        Regex.emj.lastIndex = 0;
    }

    get darkColor(): string {
        return this.permission != ActionPermission.Admin ? this.color.toDarkColor() : this.color;
    }

    private FindMedia(message: string,
                      regex: RegExp,
                      type: MediaType,
                      format: ((x: RegExpMatchArray) => string) | null = null): void {
        if (format == null) {
            format = (x) => `https://${x[1]}`;
        }

        let all: RegExpMatchArray[] = [...message.matchAll(regex)];
        all.forEach((x: RegExpMatchArray) => this.media.push(
            new Media(this.userId,
                this.name,
                this.color,
                format!(x),
                this.time,
                type,
                this.permission
            ))
        );

        regex.lastIndex = 0;
    }

    private FindY2(message: string): void {
        this.FindMedia(message,
            Regex.youtubeMobile,
            MediaType.Youtube,
            x => `https://www.youtube.com/embed/${x[1]}${x[2] !== undefined ? '?start=' + x[2] : ''}`
        );

        let all = [...message.matchAll(Regex.youtube)];
        all.forEach((x: RegExpMatchArray) => {
                let result: RegExpMatchArray | null = Regex.youtubeTime.exec(x[1]);
                let time = result != null ? result[1] : '';
                this.media.push(
                    new Media(this.userId,
                        this.name,
                        this.color,
                        `https://www.youtube.com/embed/${x[2]}${time}`,
                        this.time,
                        MediaType.Youtube,
                        this.permission
                    ))
            }
        );
        Regex.youtube.lastIndex = 0;
    }
}
