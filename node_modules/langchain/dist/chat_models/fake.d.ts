import { BaseChatModel, BaseChatModelParams } from "./base.js";
import { AIMessage, BaseMessage, ChatGenerationChunk, ChatResult } from "../schema/index.js";
import { CallbackManagerForLLMRun } from "../callbacks/manager.js";
/**
 * Interface for the input parameters specific to the Fake List Chat model.
 */
export interface FakeChatInput extends BaseChatModelParams {
    /** Responses to return */
    responses: string[];
    /** Time to sleep in milliseconds between responses */
    sleep?: number;
}
/**
 * A fake Chat Model that returns a predefined list of responses. It can be used
 * for testing purposes.
 */
export declare class FakeListChatModel extends BaseChatModel {
    static lc_name(): string;
    responses: string[];
    i: number;
    sleep?: number;
    constructor({ responses, sleep }: FakeChatInput);
    _combineLLMOutput(): never[];
    _llmType(): string;
    _generate(_messages: BaseMessage[], options?: this["ParsedCallOptions"]): Promise<ChatResult>;
    _formatGeneration(text: string): {
        message: AIMessage;
        text: string;
    };
    _streamResponseChunks(_messages: BaseMessage[], _options: this["ParsedCallOptions"], _runManager?: CallbackManagerForLLMRun): AsyncGenerator<ChatGenerationChunk>;
    _sleepIfRequested(): Promise<void>;
    _sleep(): Promise<void>;
    _createResponseChunk(text: string): ChatGenerationChunk;
    _currentResponse(): string;
    _incrementResponse(): void;
}
