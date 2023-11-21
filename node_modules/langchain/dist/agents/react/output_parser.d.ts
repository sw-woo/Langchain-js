import { AgentActionOutputParser } from "../types.js";
import { AgentAction, AgentFinish } from "../../schema/index.js";
/**
 * Parses ReAct-style LLM calls that have a single tool input.
 *
 * Expects output to be in one of two formats.
 *
 * If the output signals that an action should be taken,
 * should be in the below format. This will result in an AgentAction
 * being returned.
 *
 * ```
 * Thought: agent thought here
 * Action: search
 * Action Input: what is the temperature in SF?
 * ```
 *
 * If the output signals that a final answer should be given,
 * should be in the below format. This will result in an AgentFinish
 * being returned.
 *
 * ```
 * Thought: agent thought here
 * Final Answer: The temperature is 100 degrees
 * ```
 */
export declare class ReActSingleInputOutputParser extends AgentActionOutputParser {
    lc_namespace: string[];
    private toolNames;
    constructor(fields: {
        toolNames: string[];
    });
    /**
     * Parses the given text into an AgentAction or AgentFinish object. If an
     * output fixing parser is defined, uses it to parse the text.
     * @param text Text to parse.
     * @returns Promise that resolves to an AgentAction or AgentFinish object.
     */
    parse(text: string): Promise<AgentAction | AgentFinish>;
    /**
     * Returns the format instructions as a string. If the 'raw' option is
     * true, returns the raw FORMAT_INSTRUCTIONS.
     * @param options Options for getting the format instructions.
     * @returns Format instructions as a string.
     */
    getFormatInstructions(): string;
}
