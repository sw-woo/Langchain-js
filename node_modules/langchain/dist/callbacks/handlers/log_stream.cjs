"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogStreamCallbackHandler = exports.RunLog = exports.RunLogPatch = void 0;
const index_js_1 = require("../../util/fast-json-patch/index.cjs");
const tracer_js_1 = require("./tracer.cjs");
const stream_js_1 = require("../../util/stream.cjs");
/**
 * List of jsonpatch JSONPatchOperations, which describe how to create the run state
 * from an empty dict. This is the minimal representation of the log, designed to
 * be serialized as JSON and sent over the wire to reconstruct the log on the other
 * side. Reconstruction of the state can be done with any jsonpatch-compliant library,
 * see https://jsonpatch.com for more information.
 */
class RunLogPatch {
    constructor(fields) {
        Object.defineProperty(this, "ops", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.ops = fields.ops;
    }
    concat(other) {
        const ops = this.ops.concat(other.ops);
        const states = (0, index_js_1.applyPatch)({}, ops);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return new RunLog({
            ops,
            state: states[states.length - 1].newDocument,
        });
    }
}
exports.RunLogPatch = RunLogPatch;
class RunLog extends RunLogPatch {
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.state = fields.state;
    }
    concat(other) {
        const ops = this.ops.concat(other.ops);
        const states = (0, index_js_1.applyPatch)(this.state, other.ops);
        return new RunLog({ ops, state: states[states.length - 1].newDocument });
    }
}
exports.RunLog = RunLog;
/**
 * Class that extends the `BaseTracer` class from the
 * `langchain.callbacks.tracers.base` module. It represents a callback
 * handler that logs the execution of runs and emits `RunLog` instances to a
 * `RunLogStream`.
 */
class LogStreamCallbackHandler extends tracer_js_1.BaseTracer {
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "autoClose", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "includeNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "includeTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "includeTags", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "excludeNames", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "excludeTypes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "excludeTags", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "keyMapByRunId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "counterMapByRunName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "transformStream", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "writer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "receiveStream", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "log_stream_tracer"
        });
        this.autoClose = fields?.autoClose ?? true;
        this.includeNames = fields?.includeNames;
        this.includeTypes = fields?.includeTypes;
        this.includeTags = fields?.includeTags;
        this.excludeNames = fields?.excludeNames;
        this.excludeTypes = fields?.excludeTypes;
        this.excludeTags = fields?.excludeTags;
        this.transformStream = new TransformStream();
        this.writer = this.transformStream.writable.getWriter();
        this.receiveStream = stream_js_1.IterableReadableStream.fromReadableStream(this.transformStream.readable);
    }
    [Symbol.asyncIterator]() {
        return this.receiveStream;
    }
    async persistRun(_run) {
        // This is a legacy method only called once for an entire run tree
        // and is therefore not useful here
    }
    _includeRun(run) {
        if (run.parent_run_id === undefined) {
            return false;
        }
        const runTags = run.tags ?? [];
        let include = this.includeNames === undefined &&
            this.includeTags === undefined &&
            this.includeTypes === undefined;
        if (this.includeNames !== undefined) {
            include = include || this.includeNames.includes(run.name);
        }
        if (this.includeTypes !== undefined) {
            include = include || this.includeTypes.includes(run.run_type);
        }
        if (this.includeTags !== undefined) {
            include =
                include ||
                    runTags.find((tag) => this.includeTags?.includes(tag)) !== undefined;
        }
        if (this.excludeNames !== undefined) {
            include = include && !this.excludeNames.includes(run.name);
        }
        if (this.excludeTypes !== undefined) {
            include = include && !this.excludeTypes.includes(run.run_type);
        }
        if (this.excludeTags !== undefined) {
            include =
                include && runTags.every((tag) => !this.excludeTags?.includes(tag));
        }
        return include;
    }
    async onRunCreate(run) {
        if (run.parent_run_id === undefined) {
            await this.writer.write(new RunLogPatch({
                ops: [
                    {
                        op: "replace",
                        path: "",
                        value: {
                            id: run.id,
                            streamed_output: [],
                            final_output: undefined,
                            logs: {},
                        },
                    },
                ],
            }));
        }
        if (!this._includeRun(run)) {
            return;
        }
        if (this.counterMapByRunName[run.name] === undefined) {
            this.counterMapByRunName[run.name] = 0;
        }
        this.counterMapByRunName[run.name] += 1;
        const count = this.counterMapByRunName[run.name];
        this.keyMapByRunId[run.id] =
            count === 1 ? run.name : `${run.name}:${count}`;
        const logEntry = {
            id: run.id,
            name: run.name,
            type: run.run_type,
            tags: run.tags ?? [],
            metadata: run.extra?.metadata ?? {},
            start_time: new Date(run.start_time).toISOString(),
            streamed_output_str: [],
            final_output: undefined,
            end_time: undefined,
        };
        await this.writer.write(new RunLogPatch({
            ops: [
                {
                    op: "add",
                    path: `/logs/${this.keyMapByRunId[run.id]}`,
                    value: logEntry,
                },
            ],
        }));
    }
    async onRunUpdate(run) {
        try {
            const runName = this.keyMapByRunId[run.id];
            if (runName === undefined) {
                return;
            }
            const ops = [
                {
                    op: "add",
                    path: `/logs/${runName}/final_output`,
                    value: run.outputs,
                },
            ];
            if (run.end_time !== undefined) {
                ops.push({
                    op: "add",
                    path: `/logs/${runName}/end_time`,
                    value: new Date(run.end_time).toISOString(),
                });
            }
            const patch = new RunLogPatch({ ops });
            await this.writer.write(patch);
        }
        finally {
            if (run.parent_run_id === undefined) {
                const patch = new RunLogPatch({
                    ops: [
                        {
                            op: "replace",
                            path: "/final_output",
                            value: run.outputs,
                        },
                    ],
                });
                await this.writer.write(patch);
                if (this.autoClose) {
                    await this.writer.close();
                }
            }
        }
    }
    async onLLMNewToken(run, token) {
        const runName = this.keyMapByRunId[run.id];
        if (runName === undefined) {
            return;
        }
        const patch = new RunLogPatch({
            ops: [
                {
                    op: "add",
                    path: `/logs/${runName}/streamed_output_str/-`,
                    value: token,
                },
            ],
        });
        await this.writer.write(patch);
    }
}
exports.LogStreamCallbackHandler = LogStreamCallbackHandler;
