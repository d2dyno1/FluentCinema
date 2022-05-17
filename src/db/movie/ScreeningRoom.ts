import {ScreeningRoomResponse} from "$data/response/ScreeningRoomResponse";
import {client} from "$db";
import type {QueryResult} from "pg";
import _ from "underscore";

export class ScreeningRoom extends ScreeningRoomResponse {
    readonly id!: number;
    readonly cinemaId!: number;

    private static async construct(queryResult: Partial<ScreeningRoom>): Promise<ScreeningRoom> {
        return (async () => {
            return Object.assign(new ScreeningRoom(), queryResult);
        })();
    }

    static async getFromId(id: number): Promise<ScreeningRoom | null> {
        let query: QueryResult<ScreeningRoom> = (await client.query('SELECT * FROM screening_rooms where id=$1;', [id]));
        return query.rowCount == 0 ? null : ScreeningRoom.construct(query.rows[0]);
    }

    toJSON() {
        return _.omit(this, ["id", "cinemaId"]);
    }
}