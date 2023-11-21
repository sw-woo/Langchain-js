import { z } from "zod";
import { DynamicStructuredTool, } from "../../../tools/dynamic.js";
import { formatDocumentsAsString } from "../../../util/document.js";
export function createRetrieverTool(retriever, input) {
    const func = async ({ input }, runManager) => {
        const docs = await retriever.getRelevantDocuments(input, runManager?.getChild("retriever"));
        return formatDocumentsAsString(docs, "\n");
    };
    const schema = z.object({
        input: z
            .string()
            .describe("Natural language query used as input to the retriever"),
    });
    return new DynamicStructuredTool({ ...input, func, schema });
}
