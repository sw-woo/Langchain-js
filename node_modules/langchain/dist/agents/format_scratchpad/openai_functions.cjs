"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatForOpenAIFunctions = void 0;
const template_js_1 = require("../../prompts/template.cjs");
const index_js_1 = require("../../schema/index.cjs");
const prompt_js_1 = require("../chat_convo/prompt.cjs");
/**
 * Format a list of AgentSteps into a list of BaseMessage instances for
 * agents that use OpenAI's API. Helpful for passing in previous agent
 * step context into new iterations.
 *
 * @param steps A list of AgentSteps to format.
 * @returns A list of BaseMessages.
 */
function formatForOpenAIFunctions(steps) {
    const thoughts = [];
    for (const step of steps) {
        thoughts.push(new index_js_1.AIMessage(step.action.log));
        thoughts.push(new index_js_1.HumanMessage((0, template_js_1.renderTemplate)(prompt_js_1.TEMPLATE_TOOL_RESPONSE, "f-string", {
            observation: step.observation,
        })));
    }
    return thoughts;
}
exports.formatForOpenAIFunctions = formatForOpenAIFunctions;
