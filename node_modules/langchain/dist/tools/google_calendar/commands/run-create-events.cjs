"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCreateEvent = void 0;
const googleapis_1 = require("googleapis");
const index_js_1 = require("../../../prompts/index.cjs");
const index_js_2 = require("../../../chains/index.cjs");
const index_js_3 = require("../prompts/index.cjs");
const get_timezone_offset_in_hours_js_1 = require("../utils/get-timezone-offset-in-hours.cjs");
const createEvent = async ({ eventSummary, eventStartTime, eventEndTime, userTimezone, eventLocation = "", eventDescription = "", }, calendarId, auth) => {
    const calendar = googleapis_1.google.calendar("v3");
    const event = {
        summary: eventSummary,
        location: eventLocation,
        description: eventDescription,
        start: {
            dateTime: eventStartTime,
            timeZone: userTimezone,
        },
        end: {
            dateTime: eventEndTime,
            timeZone: userTimezone,
        },
    };
    try {
        const createdEvent = await calendar.events.insert({
            auth,
            calendarId,
            requestBody: event,
        });
        return createdEvent;
    }
    catch (error) {
        return {
            error: `An error occurred: ${error}`,
        };
    }
};
const runCreateEvent = async (query, { calendarId, auth, model }, runManager) => {
    const prompt = new index_js_1.PromptTemplate({
        template: index_js_3.CREATE_EVENT_PROMPT,
        inputVariables: ["date", "query", "u_timezone", "dayName"],
    });
    const createEventChain = new index_js_2.LLMChain({
        llm: model,
        prompt,
    });
    const date = new Date().toISOString();
    const u_timezone = (0, get_timezone_offset_in_hours_js_1.getTimezoneOffsetInHours)();
    const dayName = new Date().toLocaleString("en-us", { weekday: "long" });
    const output = await createEventChain.call({
        query,
        date,
        u_timezone,
        dayName,
    }, runManager?.getChild());
    const loaded = JSON.parse(output.text);
    const [eventSummary, eventStartTime, eventEndTime, eventLocation, eventDescription, userTimezone,] = Object.values(loaded);
    const event = await createEvent({
        eventSummary,
        eventStartTime,
        eventEndTime,
        userTimezone,
        eventLocation,
        eventDescription,
    }, calendarId, auth);
    if (!event.error) {
        return `Event created successfully, details: event ${event.data.htmlLink}`;
    }
    return `An error occurred creating the event: ${event.error}`;
};
exports.runCreateEvent = runCreateEvent;
