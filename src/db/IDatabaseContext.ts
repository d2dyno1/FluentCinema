export interface IDatabaseContext<T> {
    toApiContext(): T;
}