import React from "react";
import { Table, Modal, Image, Button } from "semantic-ui-react";
import "./inventory.css";

const InventoryDetail = props => {
  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell style={styles.border}>{props.trackingNumber}</Table.Cell>
        <Table.Cell style={styles.border}>{props.brand}</Table.Cell>
        <Table.Cell style={styles.border}>{props.stage}</Table.Cell>
        <Table.Cell style={styles.border}>{props.quantity}</Table.Cell>
        <Table.Cell style={styles.borderLast}>{props.broken}</Table.Cell>
        <Table.Cell style={styles.borderLast}>{props.total}</Table.Cell>
        <Table.Cell style={styles.borderLast}>{props.scanner}</Table.Cell>
        <Table.Cell style={styles.borderLast}>
          {props.warehouseLocation}
        </Table.Cell>
        <Table.Cell style={styles.border}>
          <Modal basic trigger={<Button>invoice</Button>} closeIcon>
            <Modal.Content image>
              <Image style={window.innerWidth > 768? {transform: "rotate(90deg)"}: {transform: "rotate:(0)"}} wrapped src={props.image} />
            </Modal.Content>
          </Modal>
        </Table.Cell>
        <Table.Cell style={styles.border}>{props.timeStamp}</Table.Cell>
      </Table.Row>
    </Table.Body>
  );
};

export default InventoryDetail;

const styles = {
  border: {
    borderBottom: "1px solid #ccc",
    borderRight: "1px solid #ccc",
    borderCollapse: "separate",
    borderSpacing: "4px"
  },
  borderLast: {
    borderBottom: "1px solid #ccc",
    borderCollapse: "separate",
    borderSpacing: "4px"
  }
};
