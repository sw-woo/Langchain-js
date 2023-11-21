import { LLMOptions } from "portkey-ai";
import { CallbackManagerForLLMRun } from "../callbacks/manager.js";
import { PortkeySession } from "../llms/portkey.js";
import { BaseMessage, ChatGenerationChunk, ChatResult } from "../schema/index.js";
import { BaseChatModel } from "./base.js";
export declare class PortkeyChat extends BaseChatModel {
    apiKey?: string;
    baseURL?: string;
    mode?: string;
    llms?: [LLMOptions] | null;
    session: PortkeySession;
    constructor(init?: Partial<PortkeyChat>);
    _llmType(): string;
    _generate(messages: BaseMessage[], options: this["ParsedCallOptions"], _?: CallbackManagerForLLMRun): Promise<ChatResult>;
    _streamResponseChunks(messages: BaseMessage[], options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): AsyncGenerator<ChatGenerationChunk>;
    _combineLLMOutput(): {};
}
