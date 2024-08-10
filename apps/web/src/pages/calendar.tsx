import { useEffect } from "react";
import { useState } from "react";
import { LimitedCalendarEvent } from '@advent-calendar/services'
import CalendarEventCard from "../components/calendar-event-card/calendar-event-card";
import { Col, Layout, Row, Spin } from "antd";
import Snowfall from "react-snowfall";
import background from '../assets/images/background.png'; //TODO: Consider making the background dynamic or at least give a consisten name
import './calendar.module.css';
import { chunk } from 'lodash';
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

  //TODO: Redesign this so that it is dyanmically displayed to fit the screen
  return (
    <>
      {events ? <Layout>
        <div style={{ backgroundColor: 'white' }}>
          <div style={{ fontFamily: 'Monsoon', justifyContent: 'center', textAlign: 'center', verticalAlign: 'middle', fontSize: '250%' }}>Monsoons Advent Calendar</div>
        </div>
        <Layout.Content style={{
          backgroundImage: `url(${background})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}>
          <Row style={{ overflow: 'scroll', height: 'calc(100vh - 100px)', marginTop: '2%' }}>
            <Col flex='20%'></Col>
            <Col flex='60%'>
              {chunk(events, 3).map(threeEvents => {
                return <Row key={threeEvents[0].date + 'row'}>

                  {threeEvents.map(event => {
                    return <Col key={event.date + 'Col'} flex='33%' >
                      <CalendarEventCard key={event.date + 'card'} event={event}></CalendarEventCard>
                    </Col>
                  })}
                </Row>

              })}
            </Col>
            <Col flex='20%'></Col>
            <Snowfall />
          </Row>
        </Layout.Content>

      </Layout> : <Spin />}
    </>
  );

}

export default Calendar;
