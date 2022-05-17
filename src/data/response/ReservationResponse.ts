import type {ScreeningResponse} from "./ScreeningResponse";

export abstract class ReservationResponse {
    readonly screening: ScreeningResponse;
    readonly seat!: number;

    protected constructor(screening: ScreeningResponse) {
        this.screening = screening;
    }
}