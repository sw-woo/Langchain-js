import { AgentStep, BaseMessage } from "../../schema/index.js";
/**
 * Format a list of AgentSteps into a list of BaseMessage instances for
 * agents that use OpenAI's API. Helpful for passing in previous agent
 * step context into new iterations.
 *
 * @param steps A list of AgentSteps to format.
 * @returns A list of BaseMessages.
 */
export declare function formatForOpenAIFunctions(steps: AgentStep[]): BaseMessage[];
