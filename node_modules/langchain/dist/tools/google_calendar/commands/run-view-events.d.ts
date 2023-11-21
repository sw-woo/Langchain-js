import type { JWT } from "googleapis-common";
import { BaseLLM } from "../../../llms/base.js";
import { CallbackManagerForToolRun } from "../../../callbacks/manager.js";
type RunViewEventParams = {
    calendarId: string;
    auth: JWT;
    model: BaseLLM;
};
declare const runViewEvents: (query: string, { model, auth, calendarId }: RunViewEventParams, runManager?: CallbackManagerForToolRun) => Promise<string>;
export { runViewEvents };
