import React from "react";
import { Table } from "semantic-ui-react";
import "./inventory.css";

const InventoryReportDetail = props => {
  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell style={styles.border}>{props.sku}</Table.Cell>
        <Table.Cell style={styles.border}>
          {props.brand} {props.stage}
        </Table.Cell>
        <Table.Cell style={styles.border}>{props.eastTotal}</Table.Cell>
        <Table.Cell style={styles.border}>{props.westTotal}</Table.Cell>
        <Table.Cell style={styles.border}>{props.bgTotal}</Table.Cell>
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
