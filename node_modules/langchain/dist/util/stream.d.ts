export declare class IterableReadableStream<T> extends ReadableStream<T> {
    reader: ReadableStreamDefaultReader<T>;
    ensureReader(): void;
    next(): Promise<{
        done: boolean;
        value: T;
    }>;
    return(): Promise<{
        done: boolean;
        value: T;
    }>;
    [Symbol.asyncIterator](): this;
    static fromReadableStream<T>(stream: ReadableStream<T>): IterableReadableStream<T>;
    static fromAsyncGenerator<T>(generator: AsyncGenerator<T>): IterableReadableStream<T>;
}
