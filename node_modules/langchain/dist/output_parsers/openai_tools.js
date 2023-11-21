import { BaseLLMOutputParser } from "../schema/output_parser.js";
/**
 * Class for parsing the output of an LLM into a JSON object. Uses an
 * instance of `OutputToolsParser` to parse the output.
 */
export class JsonOutputToolsParser extends BaseLLMOutputParser {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "output_parsers"]
        });
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    static lc_name() {
        return "JsonOutputToolsParser";
    }
    /**
     * Parses the output and returns a JSON object. If `argsOnly` is true,
     * only the arguments of the function call are returned.
     * @param generations The output of the LLM to parse.
     * @returns A JSON object representation of the function call or its arguments.
     */
    async parseResult(generations) {
        const toolCalls = generations[0].message.additional_kwargs.tool_calls;
        if (!toolCalls) {
            throw new Error(`No tools_call in message ${JSON.stringify(generations)}`);
        }
        const clonedToolCalls = JSON.parse(JSON.stringify(toolCalls));
        const parsedToolCalls = [];
        for (const toolCall of clonedToolCalls) {
            if (toolCall.function !== undefined) {
                const functionArgs = toolCall.function.arguments;
                parsedToolCalls.push({
                    name: toolCall.function.name,
                    arguments: JSON.parse(functionArgs),
                });
            }
        }
        return parsedToolCalls;
    }
}
