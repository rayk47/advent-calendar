export type LimitedCalendarEvent = { date: string, image: string, day: number, id: string };
export type FullCalendarEvent = LimitedCalendarEvent & { gift: EventGift };
export type EventGift = {
    image: string,
    title: string,
    description: string
}