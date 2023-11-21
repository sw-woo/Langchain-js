import { Tool } from "../base.js";
import { BaseLLM } from "../../llms/base.js";
export interface GoogleCalendarAgentParams {
    credentials?: {
        clientEmail?: string;
        privateKey?: string;
        calendarId?: string;
    };
    scopes?: string[];
    model?: BaseLLM;
}
export declare class GoogleCalendarBase extends Tool {
    name: string;
    description: string;
    protected clientEmail: string;
    protected privateKey: string;
    protected calendarId: string;
    protected scopes: string[];
    protected llm: BaseLLM;
    constructor(fields?: GoogleCalendarAgentParams);
    getModel(): BaseLLM<import("../../llms/base.js").BaseLLMCallOptions>;
    getAuth(): Promise<import("googleapis-common").JWT>;
    _call(input: string): Promise<string>;
}
