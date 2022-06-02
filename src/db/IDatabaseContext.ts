export interface IDatabaseContext<ApiContext> {
    toApiContext(): ApiContext;
}