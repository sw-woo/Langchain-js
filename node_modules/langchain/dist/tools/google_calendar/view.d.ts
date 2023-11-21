import { GoogleCalendarBase, GoogleCalendarAgentParams } from "./base.js";
import { CallbackManagerForToolRun } from "../../callbacks/manager.js";
export declare class GoogleCalendarViewTool extends GoogleCalendarBase {
    name: string;
    description: string;
    constructor(fields: GoogleCalendarAgentParams);
    _call(query: string, runManager?: CallbackManagerForToolRun): Promise<string>;
}
