"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunnablePassthrough = exports.RunnableAssign = void 0;
const base_js_1 = require("./base.cjs");
/**
 * A runnable that assigns key-value pairs to inputs of type `Record<string, unknown>`.
 */
class RunnableAssign extends base_js_1.Runnable {
    constructor(mapper) {
        super();
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "schema", "runnable"]
        });
        Object.defineProperty(this, "mapper", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.mapper = mapper;
    }
    async invoke(input, options) {
        const mapperResult = await this.mapper.invoke(input, options);
        return {
            ...input,
            ...mapperResult,
        };
    }
}
exports.RunnableAssign = RunnableAssign;
/**
 * A runnable that passes through the input.
 */
class RunnablePassthrough extends base_js_1.Runnable {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "lc_namespace", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ["langchain", "schema", "runnable"]
        });
        Object.defineProperty(this, "lc_serializable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    static lc_name() {
        return "RunnablePassthrough";
    }
    async invoke(input, options) {
        return this._callWithConfig((input) => Promise.resolve(input), input, options);
    }
    static assign(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapping) {
        return new RunnableAssign(new base_js_1.RunnableMap({ steps: mapping }));
    }
}
exports.RunnablePassthrough = RunnablePassthrough;
