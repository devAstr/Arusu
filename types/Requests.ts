import {PneumaRestriction, VoteSelectLimit, VoteTimeLimit} from '@/types/Types';

export class DoVoteRequest {
    hub: string;
    options: string[];

    constructor(hub: string, options: string[]) {
        if (IsNullOrWhiteSpace(hub)) {
            throw Error();
        }

        this.hub = hub;
        this.options = options;
    }
}

export class ExternalLoginRequest {
    code: string;

    constructor(code: string) {
        this.code = code;
    }
}

export class JoinHubRequest {
    hub: string;
    name: string;

    constructor(hub: string, name: string) {
        if (IsNullOrWhiteSpace(hub)) {
            throw Error();
        }

        this.hub = hub;
        this.name = name;
    }
}

export class NewMessageRequest {
    hub: string;
    name: string;
    message: string;

    constructor(hub: string, name: string, message: string) {
        if (IsNullOrWhiteSpace(hub)) {
            throw Error();
        }

        this.hub = hub;
        this.name = name;
        this.message = message;
    }
}

export class NewFunVoteRequest {
    hub: string;
    name: string;
    title: string;
    options: string[];
    selectLimit: VoteSelectLimit;
    timeLimit: VoteTimeLimit;

    constructor(hub: string,
                name: string,
                title: string,
                options: string[],
                selectLimit: VoteSelectLimit,
                timeLimit: VoteTimeLimit) {
        if (IsNullOrWhiteSpace(hub) ||
            IsNullOrWhiteSpace(title) ||
            title.length > 32 ||
            options === null ||
            options?.length < 2 ||
            options.length > 6 ||
            selectLimit === null ||
            timeLimit === null) {
            throw new Error();
        }

        this.hub = hub;
        this.name = name;
        this.title = title;
        this.options = options;
        this.selectLimit = selectLimit;
        this.timeLimit = timeLimit;
    }
}

export class NewTargetRequest {
    hub: string;
    name: string;
    targetId: string;
    targetName: string;

    constructor(hub: string, name: string, targetId: string, targetName: string) {
        if (IsNullOrWhiteSpace(hub) || IsNullOrWhiteSpace(targetId) || IsNullOrWhiteSpace(targetName)) {
            throw new Error();
        }

        this.hub = hub;
        this.name = name;
        this.targetId = targetId;
        this.targetName = targetName;
    }
}


export class NewPosterVoteRequest {
    hub: string;
    name: string;
    context: string;
    media: string | null;

    constructor(hub: string, name: string, context: string, media: string | null) {
        if (IsNullOrWhiteSpace(hub) || IsNullOrWhiteSpace(context)) {
            throw new Error();
        }

        this.hub = hub;
        this.name = name;
        this.context = context;
        this.media = media;
    }
}

export class NewPneumaVoteRequest {
    hub: string;
    name: string;
    restrictionType: PneumaRestriction;

    constructor(hub: string, name: string, restrictionType: PneumaRestriction) {
        if (IsNullOrWhiteSpace(hub) || restrictionType == null) {
            throw new Error();
        }

        this.hub = hub;
        this.name = name;
        this.restrictionType = restrictionType;
    }
}

export class ChangeNameRequest {
    hub: string;
    name: string;

    constructor(hub: string, name: string) {
        if (IsNullOrWhiteSpace(hub) || IsNullOrWhiteSpace(name) || name.length > 16) {
            throw new Error();
        }

        this.hub = hub;
        this.name = name;
    }
}

export class ReportRequest {
    targetId: string;
    media: string;

    constructor(targetId: string, media: string) {
        this.targetId = targetId;
        this.media = media;
    }
}
