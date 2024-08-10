import { FullCalendarEvent } from "@advent-calendar/services";
import { Modal, Image, Row, Col } from "antd";

export interface GiftModalProps {
  gift: FullCalendarEvent['gift'];
  close: () => void,
}

//TODO: Move over to using Space and Flex of antd
export function GiftModal(props: GiftModalProps) {
  return (
    <Modal title={props.gift.title} footer={null} onCancel={() => props.close()} open={true}>
      <Row>
        <Col>
          {props.gift.description}
        </Col>
      </Row>
      <Row>
        <Col>
          <Image preview={false} src={props.gift.image}></Image>
        </Col>
      </Row>

    </Modal>
  );
}

export default GiftModal;
