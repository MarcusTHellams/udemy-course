export interface PaginatedResults<Data = unknown> {
    items: Data[];
    meta: {
        itemCount: Number;
        totalItems: Number;
        totalPages: Number;
        currentPage: Number;

    };
    links?: {
        first:String;
        previous:String;
        next:String;
        last:String;
    };
}