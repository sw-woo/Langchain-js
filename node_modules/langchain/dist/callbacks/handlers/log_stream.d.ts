import { type Operation as JSONPatchOperation } from "../../util/fast-json-patch/index.js";
import { BaseTracer, type Run } from "./tracer.js";
import { BaseCallbackHandlerInput } from "../base.js";
import { IterableReadableStream } from "../../util/stream.js";
/**
 * Interface that represents the structure of a log entry in the
 * `LogStreamCallbackHandler`.
 */
export type LogEntry = {
    /** ID of the sub-run. */
    id: string;
    /** Name of the object being run. */
    name: string;
    /** Type of the object being run, eg. prompt, chain, llm, etc. */
    type: string;
    /** List of tags for the run. */
    tags: string[];
    /** Key-value pairs of metadata for the run. */
    metadata: Record<string, any>;
    /** ISO-8601 timestamp of when the run started. */
    start_time: string;
    /** List of LLM tokens streamed by this run, if applicable. */
    streamed_output_str: string[];
    /** Final output of this run. Only available after the run has finished successfully. */
    final_output?: any;
    /** ISO-8601 timestamp of when the run ended. Only available after the run has finished. */
    end_time?: string;
};
export type RunState = {
    /** ID of the sub-run. */
    id: string;
    /** List of output chunks streamed by Runnable.stream() */
    streamed_output: any[];
    /** Final output of the run, usually the result of aggregating streamed_output. Only available after the run has finished successfully. */
    final_output?: any;
    /**
     * List of sub-runs contained in this run, if any, in the order they were started.
     * If filters were supplied, this list will contain only the runs that matched the filters.
     */
    logs: Record<string, LogEntry>;
};
/**
 * List of jsonpatch JSONPatchOperations, which describe how to create the run state
 * from an empty dict. This is the minimal representation of the log, designed to
 * be serialized as JSON and sent over the wire to reconstruct the log on the other
 * side. Reconstruction of the state can be done with any jsonpatch-compliant library,
 * see https://jsonpatch.com for more information.
 */
export declare class RunLogPatch {
    ops: JSONPatchOperation[];
    constructor(fields: {
        ops: JSONPatchOperation[];
    });
    concat(other: RunLogPatch): RunLog;
}
export declare class RunLog extends RunLogPatch {
    state: RunState;
    constructor(fields: {
        ops: JSONPatchOperation[];
        state: RunState;
    });
    concat(other: RunLogPatch): RunLog;
}
export interface LogStreamCallbackHandlerInput extends BaseCallbackHandlerInput {
    autoClose?: boolean;
    includeNames?: string[];
    includeTypes?: string[];
    includeTags?: string[];
    excludeNames?: string[];
    excludeTypes?: string[];
    excludeTags?: string[];
}
/**
 * Class that extends the `BaseTracer` class from the
 * `langchain.callbacks.tracers.base` module. It represents a callback
 * handler that logs the execution of runs and emits `RunLog` instances to a
 * `RunLogStream`.
 */
export declare class LogStreamCallbackHandler extends BaseTracer {
    protected autoClose: boolean;
    protected includeNames?: string[];
    protected includeTypes?: string[];
    protected includeTags?: string[];
    protected excludeNames?: string[];
    protected excludeTypes?: string[];
    protected excludeTags?: string[];
    private keyMapByRunId;
    private counterMapByRunName;
    protected transformStream: TransformStream;
    writer: WritableStreamDefaultWriter;
    receiveStream: IterableReadableStream<RunLogPatch>;
    name: string;
    constructor(fields?: LogStreamCallbackHandlerInput);
    [Symbol.asyncIterator](): IterableReadableStream<RunLogPatch>;
    protected persistRun(_run: Run): Promise<void>;
    _includeRun(run: Run): boolean;
    onRunCreate(run: Run): Promise<void>;
    onRunUpdate(run: Run): Promise<void>;
    onLLMNewToken(run: Run, token: string): Promise<void>;
}
