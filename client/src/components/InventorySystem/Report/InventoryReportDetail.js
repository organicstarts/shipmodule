import React from "react";
import { Table, Input, Button } from "semantic-ui-react";
import "../inventory.css";

const InventoryReportDetail = props => {
  return (
    <Table.Body>
      <Table.Row>
        <Table.Cell style={styles.border}>{props.sku}</Table.Cell>
        <Table.Cell style={styles.border}>{props.brand}</Table.Cell>
        <Table.Cell style={styles.border}>{props.stage}</Table.Cell>
        <Table.Cell style={styles.border}>
          <Input
            style={{width: "75px"}}
            floated="left"
            value={props.total}
            name={props.sku}
            onChange={props.handleChange}
            type="text"
          />
          <Button style={{marginTop: "5%"}} onClick={() => props.handleSubmitButton(props.sku)} color="olive" compact floated="right" icon="checkmark" /> 
        </Table.Cell>
        <Table.Cell style={styles.borderLast}>{props.scanner}</Table.Cell>
        <Table.Cell style={styles.border}>{props.timeStamp}</Table.Cell>
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
