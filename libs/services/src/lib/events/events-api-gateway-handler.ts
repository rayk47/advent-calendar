import { APIGatewayProxyHandler, APIGatewayEvent } from 'aws-lambda';
import { getCalendarEventsWithoutGift, getEventGift as getGift } from './events-service';
import moment from 'moment-timezone';

export const getAllEventInfo: APIGatewayProxyHandler = async () => {
    const events = await getCalendarEventsWithoutGift();
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(events)
    }
}

export const getEventGift: APIGatewayProxyHandler = async (event: APIGatewayEvent) => {
    const { pathParameters } = event;
    const id = pathParameters?.['eventId'];
    if (!id) {
        throw new Error('ID is required in path params');
    }
    const eventGift = await getGift(id);

    moment.tz.setDefault('America/Los_Angeles'); //TODO this should probably be dynamic and be based on the request from the user
    const eventDate = moment(eventGift.date);
    const isOpenedTooEarly = moment().tz('America/Los_Angeles').isSameOrBefore(eventDate, 'date');
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(isOpenedTooEarly ? {} : eventGift)
    }
}