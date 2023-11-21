"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatToOpenAIAssistantTool = exports.formatToOpenAITool = exports.formatToOpenAIFunction = void 0;
const zod_to_json_schema_1 = require("zod-to-json-schema");
/**
 * Formats a `StructuredTool` instance into a format that is compatible
 * with OpenAI's ChatCompletionFunctions. It uses the `zodToJsonSchema`
 * function to convert the schema of the `StructuredTool` into a JSON
 * schema, which is then used as the parameters for the OpenAI function.
 */
function formatToOpenAIFunction(tool) {
    return {
        name: tool.name,
        description: tool.description,
        parameters: (0, zod_to_json_schema_1.zodToJsonSchema)(tool.schema),
    };
}
exports.formatToOpenAIFunction = formatToOpenAIFunction;
function formatToOpenAITool(tool) {
    const schema = (0, zod_to_json_schema_1.zodToJsonSchema)(tool.schema);
    return {
        type: "function",
        function: {
            name: tool.name,
            description: tool.description,
            parameters: schema,
        },
    };
}
exports.formatToOpenAITool = formatToOpenAITool;
function formatToOpenAIAssistantTool(tool) {
    return {
        type: "function",
        function: {
            name: tool.name,
            description: tool.description,
            parameters: (0, zod_to_json_schema_1.zodToJsonSchema)(tool.schema),
        },
    };
}
exports.formatToOpenAIAssistantTool = formatToOpenAIAssistantTool;
