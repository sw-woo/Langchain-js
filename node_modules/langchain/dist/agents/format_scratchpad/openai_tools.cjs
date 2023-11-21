"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToOpenAIToolMessages = void 0;
const index_js_1 = require("../../schema/index.cjs");
function formatToOpenAIToolMessages(steps) {
    return steps.flatMap(({ action, observation }) => {
        if ("messageLog" in action && action.messageLog !== undefined) {
            const log = action.messageLog;
            return log.concat(new index_js_1.ToolMessage({
                content: observation,
                tool_call_id: action.toolCallId,
            }));
        }
        else {
            return [new index_js_1.AIMessage(action.log)];
        }
    });
}
exports.formatToOpenAIToolMessages = formatToOpenAIToolMessages;
