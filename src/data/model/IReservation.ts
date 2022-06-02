export interface IReservation {
    readonly seat: number;
    readonly date: Date | string;
    readonly movieName: string;
    readonly movieId: number;
}