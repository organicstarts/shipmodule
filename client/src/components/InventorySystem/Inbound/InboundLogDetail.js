import React from "react";
import { Table, Modal, Image, Icon } from "semantic-ui-react";
import "../inventory.css";

const InboundLogDetail = props => {
  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell style={styles.border}>{props.carrier}</Table.Cell>
        <Table.Cell style={styles.border}>{props.trackingNumber}</Table.Cell>
        <Table.Cell style={styles.border}>{props.invoiceNum}</Table.Cell>
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
          <Modal
            trigger={
              <Icon
                onClick={() => props.loadImage(props.trackingNumber)}
                style={styles.hover}
                bordered
                name="file alternate"
              />
            }
            closeIcon
          >
            <Modal.Content image>
              <Image wrapped src={props.image} />
            </Modal.Content>
          </Modal>
          <Icon
            onClick={() => props.handleTotal(props.id)}
            style={styles.hover}
            bordered
            inverted
            color={props.show ? "grey" : "green"}
            disabled={props.show ? true : false}
            name="check"
          />
          <Icon
            style={styles.hover}
            onClick={() => props.handleTotal(props.id)}
            bordered
            inverted
            color={props.show ? "red" : "grey"}
            disabled={props.show ? false : true}
            name="undo"
          />
          <Icon
            onClick={() => props.archiveInventory(props.id, props.index)}
            style={styles.hover}
            bordered
            inverted
            color="red"
            name="delete"
          />
        </Table.Cell>
        <Table.Cell style={styles.border}>{props.timeStamp}</Table.Cell>
      </Table.Row>
    </Table.Body>
  );
};

export default InboundLogDetail;

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
  },
  hover: {
    cursor: "pointer"
  }
};
