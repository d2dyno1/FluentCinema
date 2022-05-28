import type { IScreeningRoom } from "$data/model/IScreeningRoom";

export class ScreeningRoomApiContext implements IScreeningRoom {
    readonly seatRowCount: number;
    readonly seatRowLength: number;

    constructor(screeningRoom: IScreeningRoom) {
        this.seatRowCount = screeningRoom.seatRowCount;
        this.seatRowLength = screeningRoom.seatRowLength;
    }
}