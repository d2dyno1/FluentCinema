export abstract class ReservationRow {
    public readonly id: string;
    public readonly userId: string;
    public readonly screeningId: number;
    public readonly seat: number;

    protected constructor(row: ReservationRow) {
        this.id = row.id;
        this.userId = row.userId;
        this.screeningId = row.screeningId;
        this.seat = row.seat;
    }
}