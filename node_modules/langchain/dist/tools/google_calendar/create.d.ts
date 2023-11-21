import { CallbackManagerForToolRun } from "../../callbacks/manager.js";
import { GoogleCalendarBase, GoogleCalendarAgentParams } from "./base.js";
export declare class GoogleCalendarCreateTool extends GoogleCalendarBase {
    name: string;
    description: string;
    constructor(fields: GoogleCalendarAgentParams);
    _call(query: string, runManager?: CallbackManagerForToolRun): Promise<string>;
}
