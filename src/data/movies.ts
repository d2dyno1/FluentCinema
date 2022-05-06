export type MovieData = {
    name: string;
    description: string;
    rating: number;
    bannerImage?: any;
    posterImage?: any;
};

export type MovieDataExtended = {
    internal: MovieData;
    // TODO: Add extended data (comments, reviews, annotations, etc.)
}