export type MovieData = {
    id: number,
    name: string; // Name of the movie
    description: string; // Description (episode, chapter)
    descriptionExtended: string; // Description of the movie
    rating: number; // Rating 1-5
    bannerImage?: any; // Movie banner
    posterImage?: any; // Movie poster,
    length: number,
    release: Date
};

export type MovieDataExtended = {
    internal: MovieData;
    // TODO: Add extended data (comments, reviews, etc.)
}