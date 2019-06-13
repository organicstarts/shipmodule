import React from "react";
import { Table, Modal, Image, Icon, Button, Input } from "semantic-ui-react";
import "../inventory.css";

const InboundLogDetail = props => {
  return (
    <Table.Body>
      <Table.Row>
        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "100px" }}
              floated="left"
              value={props.carrier}
              name="carrier"
              placeholder={props.index}
              onChange={props.handleChange}
              type="text"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.border}>{props.carrier}</Table.Cell>
        )}
        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "130px" }}
              floated="left"
              value={props.trackingNumber}
              name="trackingNumber"
              placeholder={props.index}
              onChange={props.handleChange}
              type="text"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.border}>{props.trackingNumber}</Table.Cell>
        )}
        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "75px" }}
              floated="left"
              value={props.invoiceNum}
              name="invoiceNum"
              placeholder={props.index}
              onChange={props.handleChange}
              type="text"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.border}>{props.invoiceNum}</Table.Cell>
        )}
        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "100px" }}
              floated="left"
              value={props.brand}
              name="brand"
              placeholder={props.index}
              onChange={props.handleChange}
              type="text"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.border}>{props.brand}</Table.Cell>
        )}
        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "50px" }}
              floated="left"
              value={props.stage}
              name="stage"
              placeholder={props.index}
              onChange={props.handleChange}
              type="text"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.border}>{props.stage}</Table.Cell>
        )}
        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "50px" }}
              floated="left"
              value={props.quantity}
              name="quantity"
              placeholder={props.index}
              onChange={props.handleChange}
              type="text"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.border}>{props.quantity}</Table.Cell>
        )}
        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "50px" }}
              floated="left"
              value={props.broken}
              name="broken"
              placeholder={props.index}
              onChange={props.handleChange}
              type="text"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.borderLast}>{props.broken}</Table.Cell>
        )}
        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "50px" }}
              floated="left"
              value={props.total}
              name="total"
              placeholder={props.index}
              onChange={props.handleChange}
              type="text"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.borderLast}>{props.total}</Table.Cell>
        )}
        <Table.Cell style={styles.borderLast}>{props.scanner}</Table.Cell>
        <Table.Cell style={styles.borderLast}>
          {props.warehouseLocation}
        </Table.Cell>
        <Table.Cell style={styles.border}>
          <Modal
            trigger={
              <Icon
                onClick={() =>
                  props.loadImage(
                    props.oldTracking ? props.oldTracking : props.trackingNumber
                  )
                }
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
          {props.showInput ? (
            <Icon
              style={styles.hover}
              onClick={() => props.handleSubmitButton(props.id, props.index)}
              color="olive"
              bordered
              inverted
              name="checkmark"
            />
          ) : (
            <Icon
              onClick={() => props.handleTotal(props.id, props.index)}
              style={styles.hover}
              bordered
              inverted
              color={props.show ? "grey" : "green"}
              disabled={props.show ? true : false}
              name="check"
            />
          )}

          <Icon
            style={styles.hover}
            onClick={() => props.handleTotal(props.id, props.index)}
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
          <Icon
            onClick={() => props.toggleInput(props.index)}
            style={styles.hover}
            bordered
            inverted
            color="teal"
            name="edit"
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
