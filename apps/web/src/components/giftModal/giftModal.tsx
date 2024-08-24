import { FullCalendarEvent } from "@advent-calendar/services";
import { Modal, Image, Space } from "antd";

export interface GiftModalProps {
  gift: FullCalendarEvent['gift'];
  close: () => void,
}

export function GiftModal(props: GiftModalProps) {
  return (
    <Modal title={props.gift.title} footer={null} onCancel={() => props.close()} open={true}>
      <Space direction="vertical">
        <Space>
          {props.gift.description}
        </Space>
        <Space>
          <Image preview={false} src={props.gift.image}></Image>
        </Space>
      </Space>
    </Modal>
  );
}

export default GiftModal;
