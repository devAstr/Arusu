// Responses
export enum ActionPermission {
    Admin = 0,
    Bot = 1,
    NoMedia = 2
}

export enum VoteSelectLimit {
    One = 1, Two = 2, Three = 3, Four = 4, Five = 5
}

export enum PneumaRestriction {
    Infinity = -1,
    // @ts-ignore
    None = null,
    L0 = 0,
    L5 = 5,
    L10 = 10,
    L20 = 20,
    L40 = 40,
    L80 = 80,
    L120 = 120,
    L160 = 160
}

export let PneumaRestrictionList: (number | null)[] = [
    PneumaRestriction.None,
    PneumaRestriction.L0,
    PneumaRestriction.L5,
    PneumaRestriction.L10,
    PneumaRestriction.L20,
    PneumaRestriction.L40,
    PneumaRestriction.L80,
    PneumaRestriction.L120,
    PneumaRestriction.L160
];

export enum VoteTimeLimit {
    Half = 30,
    One = 60,
    Two = 120
}

export enum VoteType {
    Unknown = -1,
    Fun = 0,
    Fire = 1,
    Ban = 2,
    UnBan = 3,
    Poster = 4,
    Pneuma = 5
}

// Ui
export enum Select {
    Ban, Fire
}

export enum Media {
    Image = 0, Video = 1, Youtube = 2
}

export enum MediaDisplay {
    Normal, Mask, Hide
}

export enum Command {
    DeleteMedia = '/delete'
}

export enum Cookie {
    OpenMedia = 'open_media',
    OpenPoster = 'open_poster',
    OpenVote = 'open_vote',
    Dark = 'dark',
    AccessToken = 'access_token',
    Version = 'version',
    Name = 'name',
    Imgur = 'i'
}

export enum ClientFunction {
    Ban = 'Ban',
    Login = 'Login',
    NewMessage = 'NewMessage',
    NewPoster = 'NewPoster',
    NewVote = 'NewVote',
    OnlineUser = 'OnlineUser',
    PneumaChange = 'PneumaChange',
    RestrictionChange = 'RestrictionChange',
    VoteStatistics = 'VoteStatistics',
    Ready = 'Ready',
    HubBaned = 'HubBaned',
    Notification = 'Notification',
    Announcement = 'Announcement'
}

export enum ServerFunction {
    JoinHub = 'joinHub',
    NewMessage = 'newMessage',
    NewFunVote = 'newFunVote',
    NewBanVote = 'newBanVote',
    NewFireVote = 'newFireVote',
    NewPosterVote = 'newPosterVote',
    NewPneumaVote = 'newPneumaVote',
    DoVote = 'doVote',
    ChangeName = 'changeName',
    ChangeColor = 'changeColor',
    // Report        = 'report'
}
