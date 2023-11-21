import type { KVNamespace } from "@cloudflare/workers-types";
import { BaseCache, Generation } from "../schema/index.js";
/**
 * Represents a specific implementation of a caching mechanism using Cloudflare KV
 * as the underlying storage system. It extends the `BaseCache` class and
 * overrides its methods to provide the Cloudflare KV-specific logic.
 */
export declare class CloudflareKVCache extends BaseCache {
    private binding;
    constructor(binding: KVNamespace);
    /**
     * Retrieves data from the cache. It constructs a cache key from the given
     * `prompt` and `llmKey`, and retrieves the corresponding value from the
     * Cloudflare KV namespace.
     * @param prompt The prompt used to construct the cache key.
     * @param llmKey The LLM key used to construct the cache key.
     * @returns An array of Generations if found, null otherwise.
     */
    lookup(prompt: string, llmKey: string): Promise<Generation[] | null>;
    /**
     * Updates the cache with new data. It constructs a cache key from the
     * given `prompt` and `llmKey`, and stores the `value` in the Cloudflare KV
     * namespace.
     * @param prompt The prompt used to construct the cache key.
     * @param llmKey The LLM key used to construct the cache key.
     * @param value The value to be stored in the cache.
     */
    update(prompt: string, llmKey: string, value: Generation[]): Promise<void>;
}
