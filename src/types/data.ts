export interface PaginationMetadata {
    currentPage: number;
    perPage:number;
    total:number;
    from:number;
    to:number;
    lastPage:number;
}

export type Params = PaginationMetadata & {
    search: string
}