import type {ScreeningRoom} from "./ScreeningRoom";
import type {Movie} from "$db/movie/Movie";
import type {Cinema} from "./Cinema";

export interface Screening {
    id: number,
    cinema: Cinema,
    roomId: number,
    movie: Movie,
    room: ScreeningRoom,
    length: number
}