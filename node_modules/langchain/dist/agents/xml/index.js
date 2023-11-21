import { LLMChain } from "../../chains/llm_chain.js";
import { AIMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate, } from "../../prompts/chat.js";
import { BaseSingleActionAgent } from "../agent.js";
import { AGENT_INSTRUCTIONS } from "./prompt.js";
import { XMLAgentOutputParser } from "./output_parser.js";
/**
 * Class that represents an agent that uses XML tags.
 */
export class XMLAgent extends BaseSingleActionAgent {
    static lc_name() {
        return "XMLAgent";
    }
    _agentType() {
        return "xml";
    }
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "agents", "xml"]
        });
        Object.defineProperty(this, "tools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "llmChain", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "outputParser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new XMLAgentOutputParser()
        });
        this.tools = fields.tools;
        this.llmChain = fields.llmChain;
    }
    get inputKeys() {
        return ["input"];
    }
    static createPrompt() {
        return ChatPromptTemplate.fromMessages([
            HumanMessagePromptTemplate.fromTemplate(AGENT_INSTRUCTIONS),
            AIMessagePromptTemplate.fromTemplate("{intermediate_steps}"),
        ]);
    }
    /**
     * Plans the next action or finish state of the agent based on the
     * provided steps, inputs, and optional callback manager.
     * @param steps The steps to consider in planning.
     * @param inputs The inputs to consider in planning.
     * @param callbackManager Optional CallbackManager to use in planning.
     * @returns A Promise that resolves to an AgentAction or AgentFinish object representing the planned action or finish state.
     */
    async plan(steps, inputs, callbackManager) {
        let log = "";
        for (const { action, observation } of steps) {
            log += `<tool>${action.tool}</tool><tool_input>${action.toolInput}</tool_input><observation>${observation}</observation>`;
        }
        let tools = "";
        for (const tool of this.tools) {
            tools += `${tool.name}: ${tool.description}\n`;
        }
        const _inputs = {
            intermediate_steps: log,
            tools,
            question: inputs.input,
            stop: ["</tool_input>", "</final_answer>"],
        };
        const response = await this.llmChain.call(_inputs, callbackManager);
        return this.outputParser.parse(response[this.llmChain.outputKey]);
    }
    /**
     * Creates an XMLAgent from a BaseLanguageModel and a list of tools.
     * @param llm The BaseLanguageModel to use.
     * @param tools The tools to be used by the agent.
     * @param args Optional arguments for creating the agent.
     * @returns An instance of XMLAgent.
     */
    static fromLLMAndTools(llm, tools, args) {
        const prompt = XMLAgent.createPrompt();
        const chain = new LLMChain({
            prompt,
            llm,
            callbacks: args?.callbacks,
        });
        return new XMLAgent({
            llmChain: chain,
            tools,
        });
    }
}
