"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioSubtitleLoader = exports.AudioTranscriptSentencesLoader = exports.AudioTranscriptParagraphsLoader = exports.AudioTranscriptLoader = void 0;
const assemblyai_1 = require("assemblyai");
const document_js_1 = require("../../document.cjs");
const base_js_1 = require("../base.cjs");
const env_js_1 = require("../../util/env.cjs");
/**
 * Base class for AssemblyAI loaders.
 */
class AssemblyAILoader extends base_js_1.BaseDocumentLoader {
    /**
     * Creates a new AssemblyAI loader.
     * @param assemblyAIOptions The options to configure the AssemblyAI loader.
     * Configure the `assemblyAIOptions.apiKey` with your AssemblyAI API key, or configure it as the `ASSEMBLYAI_API_KEY` environment variable.
     */
    constructor(assemblyAIOptions) {
        super();
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        let options = assemblyAIOptions;
        if (!options) {
            options = {};
        }
        if (!options.apiKey) {
            options.apiKey = (0, env_js_1.getEnvironmentVariable)("ASSEMBLYAI_API_KEY");
        }
        if (!options.apiKey) {
            throw new Error("No AssemblyAI API key provided");
        }
        this.client = new assemblyai_1.AssemblyAI(options);
    }
}
class CreateTranscriptLoader extends AssemblyAILoader {
    /**
     * Retrevies an existing transcript by its ID.
     * @param params The parameters to create the transcript, or the ID of the transcript to retrieve.
     * @param assemblyAIOptions The options to configure the AssemblyAI loader.
     * Configure the `assemblyAIOptions.apiKey` with your AssemblyAI API key, or configure it as the `ASSEMBLYAI_API_KEY` environment variable.
     */
    constructor(params, assemblyAIOptions) {
        super(assemblyAIOptions);
        Object.defineProperty(this, "CreateTranscriptParameters", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "transcriptId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (typeof params === "string") {
            this.transcriptId = params;
        }
        else {
            this.CreateTranscriptParameters = params;
        }
    }
    async getOrCreateTranscript() {
        if (this.transcriptId) {
            return await this.client.transcripts.get(this.transcriptId);
        }
        if (this.CreateTranscriptParameters) {
            return await this.client.transcripts.create(this.CreateTranscriptParameters);
        }
    }
}
/**
 * Creates and loads the transcript as a document using AssemblyAI.
 */
class AudioTranscriptLoader extends CreateTranscriptLoader {
    /**
     * Creates a transcript and loads the transcript as a document using AssemblyAI.
     * @returns A promise that resolves to a single document containing the transcript text
     * as the page content, and the transcript object as the metadata.
     */
    async load() {
        const transcript = await this.getOrCreateTranscript();
        return [
            new document_js_1.Document({
                pageContent: transcript.text,
                metadata: transcript,
            }),
        ];
    }
}
exports.AudioTranscriptLoader = AudioTranscriptLoader;
/**
 * Creates a transcript and loads the paragraphs of the transcript, creating a document for each paragraph.
 */
class AudioTranscriptParagraphsLoader extends CreateTranscriptLoader {
    /**
     * Creates a transcript and loads the paragraphs of the transcript, creating a document for each paragraph.
     * @returns A promise that resolves to an array of documents, each containing a paragraph of the transcript.
     */
    async load() {
        const transcript = await this.getOrCreateTranscript();
        const paragraphsResponse = await this.client.transcripts.paragraphs(transcript.id);
        return paragraphsResponse.paragraphs.map((p) => new document_js_1.Document({
            pageContent: p.text,
            metadata: p,
        }));
    }
}
exports.AudioTranscriptParagraphsLoader = AudioTranscriptParagraphsLoader;
/**
 * Creates a transcript for the given `CreateTranscriptParameters.audio_url`,
 * and loads the sentences of the transcript, creating a document for each sentence.
 */
class AudioTranscriptSentencesLoader extends CreateTranscriptLoader {
    /**
     * Creates a transcript and loads the sentences of the transcript, creating a document for each sentence.
     * @returns A promise that resolves to an array of documents, each containing a sentence of the transcript.
     */
    async load() {
        const transcript = await this.getOrCreateTranscript();
        const sentencesResponse = await this.client.transcripts.sentences(transcript.id);
        return sentencesResponse.sentences.map((p) => new document_js_1.Document({
            pageContent: p.text,
            metadata: p,
        }));
    }
}
exports.AudioTranscriptSentencesLoader = AudioTranscriptSentencesLoader;
/**
 * Creates a transcript and loads subtitles for the transcript as `srt` or `vtt` format.
 */
class AudioSubtitleLoader extends CreateTranscriptLoader {
    /**
     * Creates a new AudioSubtitleLoader.
     * @param params The parameters to create the transcript, or the ID of the transcript to retrieve.
     * @param subtitleFormat The format of the subtitles, either `srt` or `vtt`.
     * @param assemblyAIOptions The options to configure the AssemblyAI loader.
     * Configure the `assemblyAIOptions.apiKey` with your AssemblyAI API key, or configure it as the `ASSEMBLYAI_API_KEY` environment variable.
     */
    constructor(params, subtitleFormat = "srt", assemblyAIOptions) {
        super(params, assemblyAIOptions);
        Object.defineProperty(this, "subtitleFormat", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: subtitleFormat
        });
        this.subtitleFormat = subtitleFormat;
    }
    /**
     * Creates a transcript and loads subtitles for the transcript as `srt` or `vtt` format.
     * @returns A promise that resolves a document containing the subtitles as the page content.
     */
    async load() {
        const transcript = await this.getOrCreateTranscript();
        const subtitles = await this.client.transcripts.subtitles(transcript.id, this.subtitleFormat);
        return [
            new document_js_1.Document({
                pageContent: subtitles,
            }),
        ];
    }
}
exports.AudioSubtitleLoader = AudioSubtitleLoader;
