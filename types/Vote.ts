export default interface Vote {
    Hub: string;
    Title: string;
    IssuerName: string;
    IssuerColor: string;
    Time: number;
    Options: string[];
    Times: number;
}