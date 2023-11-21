import { BaseLLMOutputParser } from "../schema/output_parser.js";
import type { ChatGeneration } from "../schema/index.js";
export type ParsedToolCall = {
    name: string;
    arguments: Record<string, any>;
};
/**
 * Class for parsing the output of an LLM into a JSON object. Uses an
 * instance of `OutputToolsParser` to parse the output.
 */
export declare class JsonOutputToolsParser extends BaseLLMOutputParser<ParsedToolCall[]> {
    static lc_name(): string;
    lc_namespace: string[];
    lc_serializable: boolean;
    /**
     * Parses the output and returns a JSON object. If `argsOnly` is true,
     * only the arguments of the function call are returned.
     * @param generations The output of the LLM to parse.
     * @returns A JSON object representation of the function call or its arguments.
     */
    parseResult(generations: ChatGeneration[]): Promise<ParsedToolCall[]>;
}
