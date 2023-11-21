export declare const get: import("convex/server").RegisteredQuery<"internal", {
    id: string;
}, Promise<any>>;
export declare const insert: import("convex/server").RegisteredMutation<"internal", {
    document: any;
    table: string;
}, Promise<void>>;
export declare const lookup: import("convex/server").RegisteredQuery<"internal", {
    key: string;
    index: string;
    table: string;
    keyField: string;
}, Promise<any[]>>;
export declare const upsert: import("convex/server").RegisteredMutation<"internal", {
    key: string;
    index: string;
    document: any;
    table: string;
    keyField: string;
}, Promise<void>>;
export declare const deleteMany: import("convex/server").RegisteredMutation<"internal", {
    key: string;
    index: string;
    table: string;
    keyField: string;
}, Promise<void>>;
