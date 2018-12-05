import React from "react";
import { Table } from "semantic-ui-react";

const LogDetail = props => {
  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell style={styles.border}>{props.action}</Table.Cell>
        <Table.Cell style={styles.border}>{props.date}</Table.Cell>
        <Table.Cell style={styles.border}>{props.user}</Table.Cell>
        <Table.Cell style={styles.border}>{props.batchorOrder}</Table.Cell>
        <Table.Cell style={styles.border}>
          {props.picker.charAt(0).toUpperCase() + props.picker.slice(1)}
        </Table.Cell>
        <Table.Cell style={styles.borderLast}>
          {props.shipper.charAt(0).toUpperCase() + props.shipper.slice(1)}
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  );
};

export default LogDetail;

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
