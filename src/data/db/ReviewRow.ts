export abstract class ReviewRow {
    public readonly id!: number;
    public readonly userId!: number;
    public readonly movieId!: number;
    public readonly rating!: number;
    public readonly content!: string;


    protected constructor(row: ReviewRow) {
        this.id = row.id;
        this.userId = row.userId;
        this.movieId = row.movieId;
        this.rating = row.rating;
        this.content = row.content;
    }
}