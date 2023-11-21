import { Document } from "../document.js";
/**
 * Given a list of documents, this util formats their contents
 * into a string, separated by newlines.
 *
 * @param documents
 * @returns A string of the documents page content, separated by newlines.
 */
export declare const formatDocumentsAsString: (documents: Document[], separator?: string) => string;
