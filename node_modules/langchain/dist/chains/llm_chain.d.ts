import { BaseChain, ChainInputs } from "./base.js";
import { BasePromptTemplate } from "../prompts/base.js";
import { BaseLanguageModel, BaseLanguageModelInput } from "../base_language/index.js";
import { ChainValues, Generation, BasePromptValue, BaseMessage } from "../schema/index.js";
import { BaseLLMOutputParser } from "../schema/output_parser.js";
import { SerializedLLMChain } from "./serde.js";
import { CallbackManager } from "../callbacks/index.js";
import { BaseCallbackConfig, CallbackManagerForChainRun, Callbacks } from "../callbacks/manager.js";
import { Runnable } from "../schema/runnable/base.js";
type LLMType = BaseLanguageModel | Runnable<BaseLanguageModelInput, string> | Runnable<BaseLanguageModelInput, BaseMessage>;
type CallOptionsIfAvailable<T> = T extends {
    CallOptions: infer CO;
} ? CO : any;
/**
 * Interface for the input parameters of the LLMChain class.
 */
export interface LLMChainInput<T extends string | object = string, Model extends LLMType = LLMType> extends ChainInputs {
    /** Prompt object to use */
    prompt: BasePromptTemplate;
    /** LLM Wrapper to use */
    llm: Model;
    /** Kwargs to pass to LLM */
    llmKwargs?: CallOptionsIfAvailable<Model>;
    /** OutputParser to use */
    outputParser?: BaseLLMOutputParser<T>;
    /** Key to use for output, defaults to `text` */
    outputKey?: string;
}
/**
 * Chain to run queries against LLMs.
 *
 * @example
 * ```ts
 * import { LLMChain } from "langchain/chains";
 * import { OpenAI } from "langchain/llms/openai";
 * import { PromptTemplate } from "langchain/prompts";
 *
 * const prompt = PromptTemplate.fromTemplate("Tell me a {adjective} joke");
 * const llm = new LLMChain({ llm: new OpenAI(), prompt });
 * ```
 */
export declare class LLMChain<T extends string | object = string, Model extends LLMType = LLMType> extends BaseChain implements LLMChainInput<T> {
    static lc_name(): string;
    lc_serializable: boolean;
    prompt: BasePromptTemplate;
    llm: Model;
    llmKwargs?: CallOptionsIfAvailable<Model>;
    outputKey: string;
    outputParser?: BaseLLMOutputParser<T>;
    get inputKeys(): string[];
    get outputKeys(): string[];
    constructor(fields: LLMChainInput<T, Model>);
    private getCallKeys;
    /** @ignore */
    _selectMemoryInputs(values: ChainValues): ChainValues;
    /** @ignore */
    _getFinalOutput(generations: Generation[], promptValue: BasePromptValue, runManager?: CallbackManagerForChainRun): Promise<unknown>;
    /**
     * Run the core logic of this chain and add to output if desired.
     *
     * Wraps _call and handles memory.
     */
    call(values: ChainValues & CallOptionsIfAvailable<Model>, config?: Callbacks | BaseCallbackConfig): Promise<ChainValues>;
    /** @ignore */
    _call(values: ChainValues & CallOptionsIfAvailable<Model>, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
    /**
     * Format prompt with values and pass to LLM
     *
     * @param values - keys to pass to prompt template
     * @param callbackManager - CallbackManager to use
     * @returns Completion from LLM.
     *
     * @example
     * ```ts
     * llm.predict({ adjective: "funny" })
     * ```
     */
    predict(values: ChainValues & CallOptionsIfAvailable<Model>, callbackManager?: CallbackManager): Promise<T>;
    _chainType(): "llm";
    static deserialize(data: SerializedLLMChain): Promise<LLMChain<string, BaseLanguageModel<any, import("../base_language/index.js").BaseLanguageModelCallOptions>>>;
    /** @deprecated */
    serialize(): SerializedLLMChain;
    _getNumTokens(text: string): Promise<number>;
}
export {};
