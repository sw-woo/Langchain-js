import { AssemblyAI, CreateTranscriptParameters, SubtitleFormat, Transcript, TranscriptParagraph, TranscriptSentence } from "assemblyai";
import { Document } from "../../document.js";
import { BaseDocumentLoader } from "../base.js";
import { AssemblyAIOptions } from "../../types/assemblyai-types.js";
export type * from "../../types/assemblyai-types.js";
/**
 * Base class for AssemblyAI loaders.
 */
declare abstract class AssemblyAILoader extends BaseDocumentLoader {
    protected client: AssemblyAI;
    /**
     * Creates a new AssemblyAI loader.
     * @param assemblyAIOptions The options to configure the AssemblyAI loader.
     * Configure the `assemblyAIOptions.apiKey` with your AssemblyAI API key, or configure it as the `ASSEMBLYAI_API_KEY` environment variable.
     */
    constructor(assemblyAIOptions?: AssemblyAIOptions);
}
declare abstract class CreateTranscriptLoader extends AssemblyAILoader {
    protected CreateTranscriptParameters?: CreateTranscriptParameters;
    protected transcriptId?: string;
    /**
     * Retrevies an existing transcript by its ID.
     * @param params The parameters to create the transcript, or the ID of the transcript to retrieve.
     * @param assemblyAIOptions The options to configure the AssemblyAI loader.
     * Configure the `assemblyAIOptions.apiKey` with your AssemblyAI API key, or configure it as the `ASSEMBLYAI_API_KEY` environment variable.
     */
    constructor(params: CreateTranscriptParameters | string, assemblyAIOptions?: AssemblyAIOptions);
    protected getOrCreateTranscript(): Promise<any>;
}
/**
 * Creates and loads the transcript as a document using AssemblyAI.
 */
export declare class AudioTranscriptLoader extends CreateTranscriptLoader {
    /**
     * Creates a transcript and loads the transcript as a document using AssemblyAI.
     * @returns A promise that resolves to a single document containing the transcript text
     * as the page content, and the transcript object as the metadata.
     */
    load(): Promise<Document<Transcript>[]>;
}
/**
 * Creates a transcript and loads the paragraphs of the transcript, creating a document for each paragraph.
 */
export declare class AudioTranscriptParagraphsLoader extends CreateTranscriptLoader {
    /**
     * Creates a transcript and loads the paragraphs of the transcript, creating a document for each paragraph.
     * @returns A promise that resolves to an array of documents, each containing a paragraph of the transcript.
     */
    load(): Promise<Document<TranscriptParagraph>[]>;
}
/**
 * Creates a transcript for the given `CreateTranscriptParameters.audio_url`,
 * and loads the sentences of the transcript, creating a document for each sentence.
 */
export declare class AudioTranscriptSentencesLoader extends CreateTranscriptLoader {
    /**
     * Creates a transcript and loads the sentences of the transcript, creating a document for each sentence.
     * @returns A promise that resolves to an array of documents, each containing a sentence of the transcript.
     */
    load(): Promise<Document<TranscriptSentence>[]>;
}
/**
 * Creates a transcript and loads subtitles for the transcript as `srt` or `vtt` format.
 */
export declare class AudioSubtitleLoader extends CreateTranscriptLoader {
    private subtitleFormat;
    /**
     * Creates a new AudioSubtitleLoader.
     * @param CreateTranscriptParameters The parameters to create the transcript.
     * @param subtitleFormat The format of the subtitles, either `srt` or `vtt`.
     * @param assemblyAIOptions The options to configure the AssemblyAI loader.
     * Configure the `assemblyAIOptions.apiKey` with your AssemblyAI API key, or configure it as the `ASSEMBLYAI_API_KEY` environment variable.
     */
    constructor(CreateTranscriptParameters: CreateTranscriptParameters, subtitleFormat: SubtitleFormat, assemblyAIOptions?: AssemblyAIOptions);
    /**
     * Creates a new AudioSubtitleLoader.
     * @param transcriptId The ID of the transcript to retrieve.
     * @param subtitleFormat The format of the subtitles, either `srt` or `vtt`.
     * @param assemblyAIOptions The options to configure the AssemblyAI loader.
     * Configure the `assemblyAIOptions.apiKey` with your AssemblyAI API key, or configure it as the `ASSEMBLYAI_API_KEY` environment variable.
     */
    constructor(transcriptId: string, subtitleFormat: SubtitleFormat, assemblyAIOptions?: AssemblyAIOptions);
    /**
     * Creates a transcript and loads subtitles for the transcript as `srt` or `vtt` format.
     * @returns A promise that resolves a document containing the subtitles as the page content.
     */
    load(): Promise<Document[]>;
}
