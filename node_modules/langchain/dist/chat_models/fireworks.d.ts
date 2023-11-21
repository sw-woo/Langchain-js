import type { OpenAI as OpenAIClient } from "openai";
import type { ChatOpenAICallOptions, OpenAIChatInput } from "./openai.js";
import type { OpenAICoreRequestOptions } from "../types/openai-types.js";
import type { BaseChatModelParams } from "./base.js";
import { ChatOpenAI } from "./openai.js";
type FireworksUnsupportedArgs = "frequencyPenalty" | "presencePenalty" | "logitBias" | "functions";
type FireworksUnsupportedCallOptions = "functions" | "function_call" | "tools";
export type ChatFireworksCallOptions = Partial<Omit<ChatOpenAICallOptions, FireworksUnsupportedCallOptions>>;
/**
 * Wrapper around Fireworks API for large language models fine-tuned for chat
 *
 * Fireworks API is compatible to the OpenAI API with some limitations described in
 * https://readme.fireworks.ai/docs/openai-compatibility.
 *
 * To use, you should have the `openai` package installed and
 * the `FIREWORKS_API_KEY` environment variable set.
 */
export declare class ChatFireworks extends ChatOpenAI<ChatFireworksCallOptions> {
    static lc_name(): string;
    _llmType(): string;
    get lc_secrets(): {
        [key: string]: string;
    } | undefined;
    lc_serializable: boolean;
    fireworksApiKey?: string;
    constructor(fields?: Partial<Omit<OpenAIChatInput, "openAIApiKey" | FireworksUnsupportedArgs>> & BaseChatModelParams & {
        fireworksApiKey?: string;
    });
    toJSON(): import("../load/serializable.js").Serialized;
    completionWithRetry(request: OpenAIClient.Chat.ChatCompletionCreateParamsStreaming, options?: OpenAICoreRequestOptions): Promise<AsyncIterable<OpenAIClient.Chat.Completions.ChatCompletionChunk>>;
    completionWithRetry(request: OpenAIClient.Chat.ChatCompletionCreateParamsNonStreaming, options?: OpenAICoreRequestOptions): Promise<OpenAIClient.Chat.Completions.ChatCompletion>;
}
export {};
