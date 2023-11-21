import { Runnable } from "../schema/runnable/index.js";
import { getBytes, getLines, getMessages } from "../util/event-source-parse.js";
import { Document } from "../document.js";
import { AIMessage, AIMessageChunk, ChatMessage, ChatMessageChunk, FunctionMessage, FunctionMessageChunk, HumanMessage, HumanMessageChunk, SystemMessage, SystemMessageChunk, ToolMessage, ToolMessageChunk, } from "../schema/index.js";
import { StringPromptValue } from "../prompts/base.js";
import { ChatPromptValue } from "../prompts/chat.js";
import { IterableReadableStream } from "../util/stream.js";
function isSuperset(set, subset) {
    for (const elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function revive(obj) {
    if (Array.isArray(obj))
        return obj.map(revive);
    if (typeof obj === "object") {
        const keysArr = Object.keys(obj);
        const keys = new Set(keysArr);
        if (isSuperset(keys, new Set(["page_content", "metadata"])))
            return new Document({
                pageContent: obj.page_content,
                metadata: obj.metadata,
            });
        if (isSuperset(keys, new Set(["content", "type", "is_chunk"]))) {
            if (!obj.is_chunk) {
                if (obj.type === "human") {
                    return new HumanMessage({
                        content: obj.content,
                    });
                }
                if (obj.type === "system") {
                    return new SystemMessage({
                        content: obj.content,
                    });
                }
                if (obj.type === "chat") {
                    return new ChatMessage({
                        content: obj.content,
                        role: obj.role,
                    });
                }
                if (obj.type === "function") {
                    return new FunctionMessage({
                        content: obj.content,
                        name: obj.name,
                    });
                }
                if (obj.type === "tool") {
                    return new ToolMessage({
                        content: obj.content,
                        tool_call_id: obj.tool_call_id,
                    });
                }
                if (obj.type === "ai") {
                    return new AIMessage({
                        content: obj.content,
                    });
                }
            }
            else {
                if (obj.type === "human") {
                    return new HumanMessageChunk({
                        content: obj.content,
                    });
                }
                if (obj.type === "system") {
                    return new SystemMessageChunk({
                        content: obj.content,
                    });
                }
                if (obj.type === "chat") {
                    return new ChatMessageChunk({
                        content: obj.content,
                        role: obj.role,
                    });
                }
                if (obj.type === "function") {
                    return new FunctionMessageChunk({
                        content: obj.content,
                        name: obj.name,
                    });
                }
                if (obj.type === "tool") {
                    return new ToolMessageChunk({
                        content: obj.content,
                        tool_call_id: obj.tool_call_id,
                    });
                }
                if (obj.type === "ai") {
                    return new AIMessageChunk({
                        content: obj.content,
                    });
                }
            }
        }
        if (isSuperset(keys, new Set(["text"]))) {
            return new StringPromptValue(obj.text);
        }
        if (isSuperset(keys, new Set(["messages"]))) {
            return new ChatPromptValue({
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                messages: obj.messages.map((msg) => revive(msg)),
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const innerRevive = (key) => [
            key,
            revive(obj[key]),
        ];
        const rtn = Object.fromEntries(keysArr.map(innerRevive));
        return rtn;
    }
    return obj;
}
function deserialize(str) {
    const obj = JSON.parse(str);
    return revive(obj);
}
function removeCallbacks(options) {
    const rest = { ...options };
    delete rest.callbacks;
    return rest;
}
export class RemoteRunnable extends Runnable {
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "url", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "schema", "runnable", "remote"]
        });
        const { url, options } = fields;
        this.url = url.replace(/\/$/, ""); // remove trailing slash
        this.options = options;
    }
    async post(path, body) {
        return await fetch(`${this.url}${path}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(this.options?.timeout ?? 5000),
        });
    }
    async invoke(input, options) {
        const [config, kwargs] = this._separateRunnableConfigFromCallOptions(options);
        const response = await this.post("/invoke", {
            input,
            config: removeCallbacks(config),
            kwargs: kwargs ?? {},
        });
        return revive((await response.json()).output);
    }
    async _batch(inputs, options, _, batchOptions) {
        if (batchOptions?.returnExceptions) {
            throw new Error("returnExceptions is not supported for remote clients");
        }
        const configsAndKwargsArray = options?.map((opts) => this._separateRunnableConfigFromCallOptions(opts));
        const [configs, kwargs] = configsAndKwargsArray?.reduce(([pc, pk], [c, k]) => [
            [...pc, c],
            [...pk, k],
        ], [[], []]) ?? [undefined, undefined];
        const response = await this.post("/batch", {
            inputs,
            config: (configs ?? [])
                .map(removeCallbacks)
                .map((config) => ({ ...config, ...batchOptions })),
            kwargs,
        });
        const body = await response.json();
        if (!body.output)
            throw new Error("Invalid response from remote runnable");
        return revive(body.output);
    }
    async batch(inputs, options, batchOptions) {
        if (batchOptions?.returnExceptions) {
            throw Error("returnExceptions is not supported for remote clients");
        }
        return this._batchWithConfig(this._batch.bind(this), inputs, options, batchOptions);
    }
    async stream(input, options) {
        const [config, kwargs] = this._separateRunnableConfigFromCallOptions(options);
        const response = await this.post("/stream", {
            input,
            config,
            kwargs,
        });
        if (!response.ok) {
            const json = await response.json();
            const error = new Error(`RemoteRunnable call failed with status code ${response.status}: ${json.message}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error.response = response;
            throw error;
        }
        const { body } = response;
        if (!body) {
            throw new Error("Could not begin remote stream. Please check the given URL and try again.");
        }
        const stream = new ReadableStream({
            async start(controller) {
                const enqueueLine = getMessages((msg) => {
                    if (msg.data)
                        controller.enqueue(deserialize(msg.data));
                });
                const onLine = (line, fieldLength, flush) => {
                    enqueueLine(line, fieldLength, flush);
                    if (flush)
                        controller.close();
                };
                await getBytes(body, getLines(onLine));
            },
        });
        return IterableReadableStream.fromReadableStream(stream);
    }
}
