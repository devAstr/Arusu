import {INewVoteResponse, IPoster, IVoteStatisticsResponse} from '@/types/Responses';
import {PneumaRestriction, VoteSelectLimit, VoteType} from '@/types/Types';
import TimeHelper from '@/helpers/TimeHelper';

export default class Vote {
    readonly name: string;
    readonly color: string;
    readonly time: string;
    readonly until: number;
    readonly options: IVoteStateOption[];
    title: string;
    votedTimes: number;
    expired: boolean;
    overTimeBlockVote: boolean;
    private _payload: any;

    private _selectLimit: VoteSelectLimit | null = null;

    get selectLimit(): VoteSelectLimit {
        if (this._selectLimit == null) {
            throw new Error();
        }
        return this._selectLimit;
    }

    private __voteType: VoteType | null = null;

    private get _voteType(): VoteType {
        return this.__voteType ?? VoteType.Unknown;
    }

    private set _voteType(val: VoteType) {
        this.__voteType = val;
    }

    private constructor(name: string, color: string, title: string, time: number, remaining: number) {
        this.name = name;
        this.color = color;
        this.title = title;
        this.options = [];
        this.votedTimes = 0;
        this.until = time + remaining;
        this.time = TimeHelper.ConvertToTimeString(time);
        this.expired = false;
        this.overTimeBlockVote = false;
    }

    static createFromNewVoteResponse(response: INewVoteResponse): Vote {
        let vote = new Vote(response.name, response.color, response.title, response.time, response.remaining);
        vote._selectLimit = response.selectLimit;
        vote._voteType = response.voteType;
        vote._payload = response.payload;

        response.options.forEach((x: string) => vote.options.push(<IVoteStateOption>{option: x, statistics: 0}));

        return vote;
    }

    static createFromVoteStatisticsResponse(response: IVoteStatisticsResponse): Vote {
        let vote = new Vote(response.name, response.color, response.title, response.time, response.remaining);
        vote.overTimeBlockVote = true;
        vote.votedTimes = response.votedTimes;

        response.options.forEach((x: { option: string, statistics: number }) =>
            vote.options.push(<IVoteStateOption>{option: x.option, statistics: x.statistics}));
        vote.calc();

        return vote;
    }

    get isFunctionalVote(): Boolean {
        return this._voteType !== VoteType.Fun;
    }

    get poster(): IPoster | null {
        return this._voteType === VoteType.Poster ? this._payload as IPoster : null;
    }

    get targets(): Array<string> | null {
        return [VoteType.Ban, VoteType.Fire, VoteType.UnBan]
            .includes(this._voteType) ? this._payload as Array<string> : null;
    }

    get pneumaLevel(): PneumaRestriction | null {
        return this._voteType === VoteType.Pneuma ? this._payload as PneumaRestriction : null;
    }

    change(response: IVoteStatisticsResponse) {
        response.options.forEach(x => {
            let option = this.options.find(y => y.option === x.option);
            if (option != null) {
                option.statistics = x.statistics;
            } else {
                console.warn(`Option not exists: ${x.option}`);
            }
        });

        this.votedTimes = response.votedTimes;
        this.calc();
    }

    private calc() {
        let total: number = this.options.map(x => x.statistics).reduce((previous, current) => previous + current);
        if (total == 0) {
            return;
        }

        this.options.forEach(x => {
            x.proportion = `${Math.floor(x.statistics / total * 100)}%`;
        })
    }
}

interface IVoteStateOption {
    option: string;
    statistics: number
    proportion: string
}
