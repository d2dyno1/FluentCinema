export abstract class MovieResponse {
    readonly id!: number;
    readonly name!: string;
    readonly description!: string;
    readonly descriptionExtended!: string;
    readonly length!: number;
    readonly release!: string;
    readonly rating: number;

    protected constructor(rating: number) {
        this.rating = rating;
    }
}