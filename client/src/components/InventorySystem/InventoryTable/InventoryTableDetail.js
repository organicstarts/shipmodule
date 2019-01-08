import React from "react";
import { Table, Button, Input } from "semantic-ui-react";
import "../inventory.css";

const InventoryReportDetail = props => {
  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell style={styles.border}>{props.sku}</Table.Cell>
        <Table.Cell style={styles.border}>
          {props.brand} {props.stage}
        </Table.Cell>

        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "75px" }}
              floated="left"
              value={props.eastTotal}
              name="eastcoast"
              placeholder={props.sku}
              onChange={props.handleChange}
              type="text"
            />
            <Button
              style={{ marginTop: "5%" }}
              onClick={() => props.handleSubmitButton(props.sku, "eastcoast")}
              color="olive"
              compact
              floated="right"
              icon="checkmark"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.border}>{props.eastTotal}</Table.Cell>
        )}

        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "75px" }}
              floated="left"
              value={props.westTotal}
              name="westcoast"
              placeholder={props.sku}
              onChange={props.handleChange}
              type="text"
            />
            <Button
              style={{ marginTop: "5%" }}
              onClick={() => props.handleSubmitButton(props.sku, "westcoast")}
              color="olive"
              compact
              floated="right"
              icon="checkmark"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.border}>{props.westTotal}</Table.Cell>
        )}

        {props.showInput && props.bgTracking !== "none" ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "75px" }}
              floated="left"
              value={props.bgTotal}
              name="bigcommerce"
              placeholder={props.sku}
              onChange={props.handleChange}
              type="text"
            />
            <Button
              style={{ marginTop: "5%" }}
              onClick={() => props.handleSubmitButton(props.sku, "bigcommerce")}
              color="olive"
              compact
              floated="right"
              icon="checkmark"
            />
          </Table.Cell>
        ) : (
          <Table.Cell style={styles.border}>
            {props.bgTracking === "none" ? <span>&infin;</span> : props.bgTotal}
          </Table.Cell>
        )}

        <Table.Cell style={styles.border}>
          <Button
            onClick={() => props.handleOutOfStockSingle(props.sku)}
            icon="box"
            color={props.availability === "disabled" ? "red" : "green"}
          />
          <Button
            onClick={() => props.handleOutOfStockBundle(props.sku)}
            icon="boxes"
            color={props.bundleAvailability === "disabled" ? "red" : "green"}
            disabled={props.disable}
          />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://organicstart.com${props.link}`}
          >
            <Button icon="linkify" />
          </a>

          <Button
            onClick={() => props.toggleInput(props.index)}
            color="teal"
            icon="edit"
          />
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  );
};

export default InventoryReportDetail;

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
