"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRetrieverTool = void 0;
const zod_1 = require("zod");
const dynamic_js_1 = require("../../../tools/dynamic.cjs");
const document_js_1 = require("../../../util/document.cjs");
function createRetrieverTool(retriever, input) {
    const func = async ({ input }, runManager) => {
        const docs = await retriever.getRelevantDocuments(input, runManager?.getChild("retriever"));
        return (0, document_js_1.formatDocumentsAsString)(docs, "\n");
    };
    const schema = zod_1.z.object({
        input: zod_1.z
            .string()
            .describe("Natural language query used as input to the retriever"),
    });
    return new dynamic_js_1.DynamicStructuredTool({ ...input, func, schema });
}
exports.createRetrieverTool = createRetrieverTool;
