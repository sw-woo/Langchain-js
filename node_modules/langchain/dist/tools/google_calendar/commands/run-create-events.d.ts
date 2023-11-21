import type { JWT } from "googleapis-common";
import { BaseLLM } from "../../../llms/base.js";
import { CallbackManagerForToolRun } from "../../../callbacks/manager.js";
type RunCreateEventParams = {
    calendarId: string;
    auth: JWT;
    model: BaseLLM;
};
declare const runCreateEvent: (query: string, { calendarId, auth, model }: RunCreateEventParams, runManager?: CallbackManagerForToolRun) => Promise<string>;
export { runCreateEvent };
