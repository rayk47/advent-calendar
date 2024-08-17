import { FullCalendarEvent, LimitedCalendarEvent } from '@advent-calendar/services';
import { Image } from 'antd';
import { useState } from 'react';
import { getEventGift } from '../../client/events';
import GiftModal from '../giftModal/giftModal';
import NotAllowedModal from '../notAllowedModal/not-allowed-modal';
import styles from './calendar-event-card.module.css'

export interface CalendarEventCardProps {
  event: LimitedCalendarEvent
}

export function CalendarEventCard(props: CalendarEventCardProps) {
  const [showNotAllowedViewModal, setShowNotAllowedViewModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftEvent, setGiftEvent] = useState<FullCalendarEvent>();

  const onEventSelection = async (event: LimitedCalendarEvent) => {
    const fullEvent = await getEventGift(event.id);
    if (!fullEvent?.id) {
      setShowNotAllowedViewModal(true);
    } else {
      setGiftEvent(fullEvent);
      setShowGiftModal(true);
    }
  }

  return (
    <div style={{ maxWidth: '40vw' }}>
      <div role='button' className={styles.snowbutton} onClick={() => onEventSelection(props.event)}>
        <Image preview={false} key={props.event.date} src={props.event.image} alt={props.event.date}></Image>
        <div style={{ fontSize: '10vw' }} className={styles.centered}>{props.event.day}</div>
      </div>
      {showNotAllowedViewModal && <NotAllowedModal close={() => setShowNotAllowedViewModal(false)}></NotAllowedModal>}
      {showGiftModal && <GiftModal gift={giftEvent!['gift']} close={() => setShowGiftModal(false)}></GiftModal>}

    </div>

  );
}

export default CalendarEventCard;
