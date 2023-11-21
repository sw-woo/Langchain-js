"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleCalendarViewTool = void 0;
const base_js_1 = require("./base.cjs");
const descriptions_js_1 = require("./descriptions.cjs");
const run_view_events_js_1 = require("./commands/run-view-events.cjs");
class GoogleCalendarViewTool extends base_js_1.GoogleCalendarBase {
    constructor(fields) {
        super(fields);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "google_calendar_view"
        });
        Object.defineProperty(this, "description", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: descriptions_js_1.VIEW_TOOL_DESCRIPTION
        });
    }
    async _call(query, runManager) {
        const auth = await this.getAuth();
        const model = this.getModel();
        return (0, run_view_events_js_1.runViewEvents)(query, {
            auth,
            model,
            calendarId: this.calendarId,
        }, runManager);
    }
}
exports.GoogleCalendarViewTool = GoogleCalendarViewTool;
