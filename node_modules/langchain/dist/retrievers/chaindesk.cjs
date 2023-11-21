"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaindeskRetriever = void 0;
const retriever_js_1 = require("../schema/retriever.cjs");
const document_js_1 = require("../document.cjs");
const async_caller_js_1 = require("../util/async_caller.cjs");
class ChaindeskRetriever extends retriever_js_1.BaseRetriever {
    static lc_name() {
        return "ChaindeskRetriever";
    }
    constructor({ datastoreId, apiKey, topK, ...rest }) {
        super();
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "retrievers", "chaindesk"]
        });
        Object.defineProperty(this, "caller", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "datastoreId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "topK", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.caller = new async_caller_js_1.AsyncCaller(rest);
        this.datastoreId = datastoreId;
        this.apiKey = apiKey;
        this.topK = topK;
    }
    async getRelevantDocuments(query) {
        const r = await this.caller.call(fetch, `https://app.chaindesk.ai/api/datastores/${this.datastoreId}/query`, {
            method: "POST",
            body: JSON.stringify({
                query,
                ...(this.topK ? { topK: this.topK } : {}),
            }),
            headers: {
                "Content-Type": "application/json",
                ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}),
            },
        });
        const { results } = (await r.json());
        return results.map(({ text, score, source, ...rest }) => new document_js_1.Document({
            pageContent: text,
            metadata: {
                score,
                source,
                ...rest,
            },
        }));
    }
}
exports.ChaindeskRetriever = ChaindeskRetriever;
