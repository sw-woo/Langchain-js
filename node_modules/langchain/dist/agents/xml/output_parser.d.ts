import { AgentAction, AgentFinish } from "../../schema/index.js";
import { AgentActionOutputParser } from "../types.js";
export declare class XMLAgentOutputParser extends AgentActionOutputParser {
    lc_namespace: string[];
    static lc_name(): string;
    /**
     * Parses the output text from the agent and returns an AgentAction or
     * AgentFinish object.
     * @param text The output text from the agent.
     * @returns An AgentAction or AgentFinish object.
     */
    parse(text: string): Promise<AgentAction | AgentFinish>;
    getFormatInstructions(): string;
}
