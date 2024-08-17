import { useEffect } from "react";
import { useState } from "react";
import { LimitedCalendarEvent } from '@advent-calendar/services'
import CalendarEventCard from "../components/calendar-event-card/calendar-event-card";
import { Flex, Layout, Space, Spin } from "antd";
import Snowfall from "react-snowfall";
import background from '../assets/images/background.png';
import './calendar.module.css';
import { getAllEvents } from "../client/events";

export function Calendar() {
  const [events, setEvents] = useState<LimitedCalendarEvent[]>();

  useEffect(() => {
    async function fetchEvents() {
      const calendarEvents = await getAllEvents();
      setEvents(calendarEvents);
    }

    fetchEvents();
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {events ? <Layout>
        <Layout.Header style={{ backgroundColor: 'white' }}>
          <Flex justify="center" align="center">
            <Space style={{ fontFamily: 'CalendarTitle', fontSize: '5vw' }}>{import.meta.env.VITE_CALENDAR_NAME} Advent Calendar</Space>
          </Flex>
        </Layout.Header>

        <Layout.Content style={{
          backgroundImage: `url(${background})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}>
          <Flex style={{ marginTop: 10 }} justify="center" wrap={'wrap'} gap="middle">
            {events.map(event => {
              return <CalendarEventCard key={event.date + 'card'} event={event}></CalendarEventCard>
            })}
          </Flex>
          <Snowfall />
        </Layout.Content>
      </Layout> : <Spin />}
    </>
  );

}

export default Calendar;
