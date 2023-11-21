import { BaseChatModel, BaseChatModelParams } from "../../chat_models/base.js";
import { CallbackManagerForLLMRun } from "../../callbacks/manager.js";
import { BaseMessage, ChatGenerationChunk, ChatResult } from "../../schema/index.js";
import { type AnthropicInput } from "../../chat_models/anthropic.js";
import { BaseFunctionCallOptions } from "../../base_language/index.js";
import { StructuredTool } from "../../tools/base.js";
export interface ChatAnthropicFunctionsCallOptions extends BaseFunctionCallOptions {
    tools?: StructuredTool[];
}
export type AnthropicFunctionsInput = Partial<AnthropicInput> & BaseChatModelParams & {
    llm?: BaseChatModel;
};
export declare class AnthropicFunctions extends BaseChatModel<ChatAnthropicFunctionsCallOptions> {
    llm: BaseChatModel;
    stopSequences?: string[];
    lc_namespace: string[];
    static lc_name(): string;
    constructor(fields?: AnthropicFunctionsInput);
    invocationParams(): any;
    /** @ignore */
    _identifyingParams(): Record<string, any>;
    _streamResponseChunks(messages: BaseMessage[], options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): AsyncGenerator<ChatGenerationChunk>;
    _generate(messages: BaseMessage[], options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun | undefined): Promise<ChatResult>;
    _llmType(): string;
    /** @ignore */
    _combineLLMOutput(): never[];
}
