import { Runnable, RunnableLike, RunnableMap } from "./base.js";
import type { RunnableConfig } from "./config.js";
/**
 * A runnable that assigns key-value pairs to inputs of type `Record<string, unknown>`.
 */
export declare class RunnableAssign<RunInput extends Record<string, any> = any, RunOutput extends Record<string, any> = any, CallOptions extends RunnableConfig = RunnableConfig> extends Runnable<RunInput, RunOutput> {
    lc_namespace: string[];
    mapper: RunnableMap<RunInput>;
    constructor(mapper: RunnableMap<RunInput>);
    invoke(input: RunInput, options?: Partial<CallOptions>): Promise<RunOutput>;
}
/**
 * A runnable that passes through the input.
 */
export declare class RunnablePassthrough<RunInput> extends Runnable<RunInput, RunInput> {
    static lc_name(): string;
    lc_namespace: string[];
    lc_serializable: boolean;
    invoke(input: RunInput, options?: Partial<RunnableConfig>): Promise<RunInput>;
    static assign(mapping: Record<string, RunnableLike<Record<string, unknown>, any>>): RunnableAssign<Record<string, unknown>, Record<string, unknown>>;
}
