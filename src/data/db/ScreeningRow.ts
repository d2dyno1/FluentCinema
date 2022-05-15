export abstract class ScreeningRow {
    public readonly id: number;
    public readonly roomId: string;
    public readonly movieId: string;
    public readonly start: string;
    public readonly cinemaId: string;

    protected constructor(row: ScreeningRow) {
        this.id = row.id;
        this.roomId = row.roomId;
        this.movieId = row.movieId;
        this.start = row.start;
        this.cinemaId = row.cinemaId;
    }
}