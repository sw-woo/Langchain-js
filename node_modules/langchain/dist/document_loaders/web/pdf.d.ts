/// <reference path="../../../src/types/pdf-parse.d.ts" />
import { Document } from "../../document.js";
import { BaseDocumentLoader } from "../base.js";
/**
 * A document loader for loading data from PDFs.
 */
export declare class WebPDFLoader extends BaseDocumentLoader {
    protected blob: Blob;
    protected splitPages: boolean;
    private pdfjs;
    constructor(blob: Blob, { splitPages, pdfjs }?: {
        splitPages?: boolean | undefined;
        pdfjs?: typeof PDFLoaderImports | undefined;
    });
    /**
     * Loads the contents of the PDF as documents.
     * @returns An array of Documents representing the retrieved data.
     */
    load(): Promise<Document[]>;
}
declare function PDFLoaderImports(): Promise<{
    getDocument: typeof import("pdf-parse/lib/pdf.js/v1.10.100/build/pdf.js").getDocument;
    version: string;
}>;
export {};
