import { FullCalendarEvent, LimitedCalendarEvent } from "@advent-calendar/services";

const performGet = async<T>(url: string) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getBearerToken()
        },
        cache: 'no-cache',
        redirect: 'error'
    });

    if (!response.ok) {
        if (response.status === 401) {
            const responseBody = await response.json();
            redirectToLogin(responseBody['loginUrl']);
            return;
        }
    }
    const responseBody = await response.json();
    return responseBody as T;
}

export const getAllEvents = async () => {
    const events = performGet<LimitedCalendarEvent[]>('api/events');
    return events;
}

export const getEventGift = async (id: string) => {
    const events = performGet<FullCalendarEvent>('api/events/' + id);
    return events;
}

const getBearerToken = () => {
    const authToken = localStorage.getItem('auth');
    if (authToken !== null) {
        return authToken;
    }
    return '';
}

const redirectToLogin = (loginUrl: string) => {
    if (!loginUrl) {
        throw new Error(`No loginUrl was found after recieving a 401`);
    }
    window.location.href = loginUrl;
}