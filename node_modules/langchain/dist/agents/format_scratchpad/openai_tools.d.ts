import type { ToolsAgentStep } from "../openai/output_parser.js";
import { type BaseMessage } from "../../schema/index.js";
export declare function formatToOpenAIToolMessages(steps: ToolsAgentStep[]): BaseMessage[];
