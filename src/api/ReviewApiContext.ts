import type { IReview } from "$data/model/IReview";
import type { Fetch } from "./ApiContext";

export class ReviewApiContext implements IReview {
    readonly userId: number;
    readonly rating: number;
    readonly content: string;
    readonly username: string;

    constructor(review: IReview) {
        this.userId = review.userId;
        this.rating = review.rating;
        this.content = review.content;
        this.username = review.username;
    }

    static async getFromMovieId(fetch: Fetch, movieId: string | number): Promise<ReviewApiContext[]> {
        return fetch(`/api/cinema/movie/${movieId}/reviews`).then(response => response.json()).then((reviews: IReview[]) => {
            return reviews.map(review => new ReviewApiContext(review))
        });
    }
}