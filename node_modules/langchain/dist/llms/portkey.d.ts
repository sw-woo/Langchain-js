import { LLMOptions, Portkey as _Portkey } from "portkey-ai";
import { CallbackManagerForLLMRun } from "../callbacks/manager.js";
import { GenerationChunk, LLMResult } from "../schema/index.js";
import { BaseLLM } from "./base.js";
interface PortkeyOptions {
    apiKey?: string;
    baseURL?: string;
    mode?: string;
    llms?: [LLMOptions] | null;
}
export declare class PortkeySession {
    portkey: _Portkey;
    constructor(options?: PortkeyOptions);
}
/**
 * Get a session for the Portkey API. If one already exists with the same options,
 * it will be returned. Otherwise, a new session will be created.
 * @param options
 * @returns
 */
export declare function getPortkeySession(options?: PortkeyOptions): PortkeySession;
export declare class Portkey extends BaseLLM {
    apiKey?: string;
    baseURL?: string;
    mode?: string;
    llms?: [LLMOptions] | null;
    session: PortkeySession;
    constructor(init?: Partial<Portkey>);
    _llmType(): string;
    _generate(prompts: string[], options: this["ParsedCallOptions"], _?: CallbackManagerForLLMRun): Promise<LLMResult>;
    _streamResponseChunks(input: string, options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): AsyncGenerator<GenerationChunk>;
}
export {};
