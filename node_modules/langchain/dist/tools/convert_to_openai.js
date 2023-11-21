import { zodToJsonSchema } from "zod-to-json-schema";
/**
 * Formats a `StructuredTool` instance into a format that is compatible
 * with OpenAI's ChatCompletionFunctions. It uses the `zodToJsonSchema`
 * function to convert the schema of the `StructuredTool` into a JSON
 * schema, which is then used as the parameters for the OpenAI function.
 */
export function formatToOpenAIFunction(tool) {
    return {
        name: tool.name,
        description: tool.description,
        parameters: zodToJsonSchema(tool.schema),
    };
}
export function formatToOpenAITool(tool) {
    const schema = zodToJsonSchema(tool.schema);
    return {
        type: "function",
        function: {
            name: tool.name,
            description: tool.description,
            parameters: schema,
        },
    };
}
export function formatToOpenAIAssistantTool(tool) {
    return {
        type: "function",
        function: {
            name: tool.name,
            description: tool.description,
            parameters: zodToJsonSchema(tool.schema),
        },
    };
}
