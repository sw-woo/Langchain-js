"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XMLAgentOutputParser = void 0;
const output_parser_js_1 = require("../../schema/output_parser.cjs");
const types_js_1 = require("../types.cjs");
class XMLAgentOutputParser extends types_js_1.AgentActionOutputParser {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "agents", "xml"]
        });
    }
    static lc_name() {
        return "XMLAgentOutputParser";
    }
    /**
     * Parses the output text from the agent and returns an AgentAction or
     * AgentFinish object.
     * @param text The output text from the agent.
     * @returns An AgentAction or AgentFinish object.
     */
    async parse(text) {
        if (text.includes("</tool>")) {
            const [tool, toolInput] = text.split("</tool>");
            const _tool = tool.split("<tool>")[1];
            const _toolInput = toolInput.split("<tool_input>")[1];
            return { tool: _tool, toolInput: _toolInput, log: text };
        }
        else if (text.includes("<final_answer>")) {
            const [, answer] = text.split("<final_answer>");
            return { returnValues: { output: answer }, log: text };
        }
        else {
            throw new output_parser_js_1.OutputParserException(`Could not parse LLM output: ${text}`);
        }
    }
    getFormatInstructions() {
        throw new Error("getFormatInstructions not implemented inside OpenAIFunctionsAgentOutputParser.");
    }
}
exports.XMLAgentOutputParser = XMLAgentOutputParser;
