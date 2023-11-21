import { Document } from "../../document.js";
import { Embeddings } from "../../embeddings/base.js";
import { BaseDocumentCompressor } from "./index.js";
import { cosineSimilarity } from "../../util/math.js";
/**
 * Interface for the parameters of the `EmbeddingsFilter` class.
 */
export interface EmbeddingsFilterParams {
    embeddings: Embeddings;
    similarityFn?: (x: number[][], y: number[][]) => number[][];
    similarityThreshold?: number;
    k?: number;
}
/**
 * Class that represents a document compressor that uses embeddings to
 * drop documents unrelated to the query.
 */
export declare class EmbeddingsFilter extends BaseDocumentCompressor {
    /**
     * Embeddings to use for embedding document contents and queries.
     */
    embeddings: Embeddings;
    /**
     * Similarity function for comparing documents.
     */
    similarityFn: typeof cosineSimilarity;
    /**
     * Threshold for determining when two documents are similar enough
     * to be considered redundant. Must be specified if `k` is not set.
     */
    similarityThreshold?: number;
    /**
     * The number of relevant documents to return. Can be explicitly set to undefined, in which case
     * similarity_threshold` must be specified. Defaults to 20
     */
    k?: number | undefined;
    constructor(params: EmbeddingsFilterParams);
    compressDocuments(documents: Document[], query: string): Promise<Document[]>;
}
