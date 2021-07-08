export interface PaginatedResults<Data = unknown> {
    items: Data[];
    meta: {
        itemCount: number;
        totalItems: number;
        totalPages: number;
        currentPage: number;

    };
    links?: {
        first:String;
        previous:String;
        next:String;
        last:String;
    };
}