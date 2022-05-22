export interface IReview {
    readonly userId: number;
    readonly rating: number;
    readonly content: string;
    readonly username: string;
}