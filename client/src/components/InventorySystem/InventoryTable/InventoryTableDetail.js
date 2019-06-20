import React from "react";
import { Table, Button, Input } from "semantic-ui-react";
import "../inventory.css";

const getWarningColor = total => {
  if (total < 250) return "red";
  if (total < 350) return "orange";
  if (total < 450) return "yellow";
};

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
          </Table.Cell>
        ) : (
          <Table.Cell
            style={styles.border}
            className={getWarningColor(props.eastTotal)}
          >
            <strong> {props.eastTotal}</strong>
          </Table.Cell>
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
          </Table.Cell>
        ) : (
          <Table.Cell
            style={styles.border}
            className={getWarningColor(props.westTotal)}
          >
            <strong>{props.westTotal}</strong>
          </Table.Cell>
        )}

        {props.showInput ? (
          <Table.Cell style={styles.border}>
            <Input
              style={{ width: "75px" }}
              floated="left"
              value={props.bgTotal}
              name="bigcommerce"
              placeholder={props.sku}
              onChange={props.handleChange}
              type="text"
              disabled
            />
            {/* <Button
              style={{ marginTop: "5%" }}
              onClick={() => props.handleSubmitButton(props.sku, "bigcommerce")}
              color="olive"
              compact
              floated="right"
              icon="checkmark"
            /> */}
            <Button
              style={{ marginTop: "5%" }}
              onClick={() => props.handleSubmitButton(props.sku)}
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

        <Table.Cell
          style={props.email ? styles.border : styles.borderLess}
          disabled={props.email ? false : true}
        >
          {/* <Button
            onClick={() => props.handlePushTotalToBigCommerce(props.sku)}
            color="teal"
            icon="upload"
          /> */}
          {props.handleInfinite !== "" ? (
            <Button
              onClick={() => props.handleInfinite(props.sku)}
              color={props.bgTracking === "simple" ? "red" : "green"}
            >
              <i className="fas fa-infinity" />
            </Button>
          ) : (
            ""
          )}
          <Button
            onClick={() => props.handleOutOfStockSingle(props.sku)}
            icon="box"
            color={
              props.bgTotal === 0 && props.bgTracking === "simple"
                ? "red"
                : "green"
            }
          />
          {props.bundleTracking !== "" ? (
            <Button
              onClick={() => props.handleOutOfStockBundle(props.sku)}
              icon="boxes"
              color={
                props.bundleTotal === 0 && props.bundleTracking === "simple"
                  ? "red"
                  : "green"
              }
              disabled={props.bgTotal === 0 ? true : props.disable}
            />
          ) : (
            ""
          )}
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
    borderSpacing: "4px",
    color: "black"
  },
  borderLess: {
    borderBottom: "1px solid #ccc",
    borderRight: "1px solid #ccc",
    borderCollapse: "separate",
    borderSpacing: "4px",
    opacity: 0.2
  },
  borderLast: {
    borderBottom: "1px solid #ccc",
    borderCollapse: "separate",
    borderSpacing: "4px"
  }
};
