import { omit } from "lodash";
import { FullCalendarEvent, LimitedCalendarEvent } from "./event-types";
import { calendarEvents } from "./stubbed-events";


export const getCalendarEventsWithoutGift = async (): Promise<LimitedCalendarEvent[]> => {
    return calendarEvents.map(event => omit(event, 'gift'));
}

export const getEventGift = async (id: string): Promise<FullCalendarEvent> => {
    const event = calendarEvents.find(event => event.id === id);
    if (event) {
        return event
    } else {
        throw new Error(`No event found`);
    }
}