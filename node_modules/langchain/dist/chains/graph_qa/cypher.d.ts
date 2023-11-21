import { LLMChain } from "../../chains/llm_chain.js";
import { ChainValues } from "../../schema/index.js";
import { BasePromptTemplate } from "../../prompts/base.js";
import { BaseChain, ChainInputs } from "../base.js";
import { BaseLanguageModel } from "../../base_language/index.js";
import { CallbackManagerForChainRun } from "../../callbacks/manager.js";
import { Neo4jGraph } from "../../graphs/neo4j_graph.js";
export declare const INTERMEDIATE_STEPS_KEY = "intermediateSteps";
export interface GraphCypherQAChainInput extends ChainInputs {
    graph: Neo4jGraph;
    cypherGenerationChain: LLMChain;
    qaChain: LLMChain;
    inputKey?: string;
    outputKey?: string;
    topK?: number;
    returnIntermediateSteps?: boolean;
    returnDirect?: boolean;
}
export interface FromLLMInput {
    graph: Neo4jGraph;
    llm?: BaseLanguageModel;
    cypherLLM?: BaseLanguageModel;
    qaLLM?: BaseLanguageModel;
    qaPrompt?: BasePromptTemplate;
    cypherPrompt?: BasePromptTemplate;
    returnIntermediateSteps?: boolean;
    returnDirect?: boolean;
}
export declare class GraphCypherQAChain extends BaseChain {
    private graph;
    private cypherGenerationChain;
    private qaChain;
    private inputKey;
    private outputKey;
    private topK;
    private returnDirect;
    private returnIntermediateSteps;
    constructor(props: GraphCypherQAChainInput);
    _chainType(): "graph_cypher_chain";
    get inputKeys(): string[];
    get outputKeys(): string[];
    static fromLLM(props: FromLLMInput): GraphCypherQAChain;
    private extractCypher;
    _call(values: ChainValues, runManager?: CallbackManagerForChainRun): Promise<ChainValues>;
}
