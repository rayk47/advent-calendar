import { Modal, Space } from "antd";

export interface NotAllowedModalProps {
  close: () => void,
}

export function NotAllowedModal(props: NotAllowedModalProps) {
  return (
    <Modal title={'Nuh uh uh its too early to open that present!'} footer={null} onCancel={() => props.close()} open={true}>
      <Space style={{ width: '100%', height: 0, paddingBottom: '78%', position: 'relative' }}>
        <iframe title="Not-allowed-open-yet" src="https://giphy.com/embed/5ftsmLIqktHQA" width="100%" height="100%" style={{ position: "absolute" }} frameBorder="0" className="giphy-embed" allowFullScreen></iframe>
      </Space>
    </Modal>
  );
}

export default NotAllowedModal;
