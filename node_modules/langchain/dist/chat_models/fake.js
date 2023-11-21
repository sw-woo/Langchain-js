import { BaseChatModel } from "./base.js";
import { AIMessage, AIMessageChunk, ChatGenerationChunk, } from "../schema/index.js";
/**
 * A fake Chat Model that returns a predefined list of responses. It can be used
 * for testing purposes.
 */
export class FakeListChatModel extends BaseChatModel {
    static lc_name() {
        return "FakeListChatModel";
    }
    constructor({ responses, sleep }) {
        super({});
        Object.defineProperty(this, "responses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "i", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "sleep", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.responses = responses;
        this.sleep = sleep;
    }
    _combineLLMOutput() {
        return [];
    }
    _llmType() {
        return "fake-list";
    }
    async _generate(_messages, options) {
        await this._sleepIfRequested();
        if (options?.stop?.length) {
            return {
                generations: [this._formatGeneration(options.stop[0])],
            };
        }
        else {
            const response = this._currentResponse();
            this._incrementResponse();
            return {
                generations: [this._formatGeneration(response)],
                llmOutput: {},
            };
        }
    }
    _formatGeneration(text) {
        return {
            message: new AIMessage(text),
            text,
        };
    }
    async *_streamResponseChunks(_messages, _options, _runManager) {
        const response = this._currentResponse();
        this._incrementResponse();
        for await (const text of response) {
            await this._sleepIfRequested();
            yield this._createResponseChunk(text);
        }
    }
    async _sleepIfRequested() {
        if (this.sleep !== undefined) {
            await this._sleep();
        }
    }
    async _sleep() {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), this.sleep);
        });
    }
    _createResponseChunk(text) {
        return new ChatGenerationChunk({
            message: new AIMessageChunk({ content: text }),
            text,
        });
    }
    _currentResponse() {
        return this.responses[this.i];
    }
    _incrementResponse() {
        if (this.i < this.responses.length - 1) {
            this.i += 1;
        }
        else {
            this.i = 0;
        }
    }
}
