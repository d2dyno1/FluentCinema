import type { IDatabaseContext } from "./IDatabaseContext";
import type { IScreeningRoom } from "../data/model/IScreeningRoom";
import { ScreeningRoomApiContext } from "../api/ScreeningRoomApiContext";
import type { QueryResult } from "pg";
import { client } from "./index";
import type { ScreeningDatabaseContext } from "./ScreeningDatabaseContext";

export class ScreeningRoomDatabaseContext implements IScreeningRoom, IDatabaseContext<ScreeningRoomApiContext> {
    readonly seatRowCount!: number;
    readonly seatRowLength!: number;

    private readonly id!: number;
    private readonly cinemaId!: number;

    private constructor(screeningRoom: Partial<ScreeningDatabaseContext>) {
        Object.assign(this, screeningRoom);
    }

    static async getFromId(id: number): Promise<ScreeningRoomDatabaseContext | null> {
        let query: QueryResult<ScreeningDatabaseContext> = (await client.query('SELECT * FROM screening_rooms where id=$1;', [id]));
        return query.rowCount == 0 ? null : new ScreeningRoomDatabaseContext(query.rows[0]);
    }

    toApiContext() {
        return new ScreeningRoomApiContext(this);
    }
}