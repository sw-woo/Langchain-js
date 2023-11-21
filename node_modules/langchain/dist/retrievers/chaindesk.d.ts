import { BaseRetriever, type BaseRetrieverInput } from "../schema/retriever.js";
import { Document } from "../document.js";
import { AsyncCaller, type AsyncCallerParams } from "../util/async_caller.js";
export interface ChaindeskRetrieverArgs extends AsyncCallerParams, BaseRetrieverInput {
    datastoreId: string;
    topK?: number;
    apiKey?: string;
}
export declare class ChaindeskRetriever extends BaseRetriever {
    static lc_name(): string;
    lc_namespace: string[];
    caller: AsyncCaller;
    datastoreId: string;
    topK?: number;
    apiKey?: string;
    constructor({ datastoreId, apiKey, topK, ...rest }: ChaindeskRetrieverArgs);
    getRelevantDocuments(query: string): Promise<Document[]>;
}
