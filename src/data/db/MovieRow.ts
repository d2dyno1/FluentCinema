export abstract class MovieRow {
    public readonly row: MovieRow;
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly descriptionExtended: string;
    public readonly rating: number;
    public readonly length: number;
    public readonly release: Date;

    protected constructor(row: MovieRow) {
        this.row = row;
        this.id = row.id;
        this.name = row.name;
        this.description = row.description;
        this.descriptionExtended = row.descriptionExtended;
        this.rating = row.rating;
        this.length = row.length;
        this.release = row.release;
    }
}