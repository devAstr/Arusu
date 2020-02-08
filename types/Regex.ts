export default class Regex {
    static at: RegExp = /(?:^| )@(\S+)/gm;
    static url: RegExp = /https?:\/\/((?:(?!['<>])\S)+)/gmi;
    static image: RegExp = /https?:\/\/((?:(?!['<>])\S)+\/(?:(?!['<>])\S)+?\.(?:jpe?g|png|gif|webp)(?:\?(?:(?!['<>])\S)+|))/gi;
    static video: RegExp = /https?:\/\/((?:(?!['<>])\S)+\/(?:(?!['<>])\S)+?\.(?:mp4|webm)(?:\?(?:(?!['<>])\S)+|))/gi;
    static youtube: RegExp = /https?:\/\/www\.youtube\.com\/watch\?(\S*v=(\w+)\S*)/gi;
    static youtubeTime: RegExp = /[?&]t(?:ime_continue|)=(\d+)/gi;
    static youtubeMobile: RegExp = /https?:\/\/youtu\.be\/(\w+)(?:\?t=(\d+)|)/gi;
    static youtubeEmbedRegex: RegExp = /https?:\/\/www\.youtube\.com\/embed\/(\w+)(?:\S*?[\?\&]start=(\d*)|)/gmi;
    static emj: RegExp = /\((\w+)\)/gi;

    // (?:^| )https?:\/\/(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,})))(?::\d{2,5})?(?:\/(?![?#])[^\s]*?\.jpg)(?:\?(?:(?![?#])[^\s])+)?(?:#(?:(?![?#])[^\s])+)?(?:$| )
}