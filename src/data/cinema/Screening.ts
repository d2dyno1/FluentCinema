import type {ScreeningRoom} from "./ScreeningRoom";
import type {MovieData} from "../movies";
import type {Cinema} from "./Cinema";

export interface Screening {
    id: number,
    cinema: Cinema,
    roomId: number,
    movie: MovieData,
    room: ScreeningRoom,
    length: number
}