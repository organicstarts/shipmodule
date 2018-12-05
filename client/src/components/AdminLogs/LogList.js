import React from "react";
import LogDetail from "./LogDetail";
import { Link } from "react-router-dom";
import { Segment, Table } from "semantic-ui-react";

const LogList = props => {
  return (
    <Segment style={{ marginTop: "50px" }}>
      <Link to="/" className="noprint">
        Go Back
      </Link>
      <Table celled textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell >
              <strong>Action</strong>
            </Table.HeaderCell>
            <Table.HeaderCell >
              <strong>Date</strong>
            </Table.HeaderCell>
            <Table.HeaderCell >
              <strong>User</strong>
            </Table.HeaderCell>
            <Table.HeaderCell >
              <strong>Batch/Order</strong>
            </Table.HeaderCell>
            <Table.HeaderCell >
              <strong>Picker</strong>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <strong>Shipper</strong>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {renderLogList(props.location.state.detail.logDatas)}
      </Table>
    </Segment>
  );
};

const renderLogList = logDatas => {
  return Object.keys(logDatas)
    .map(key => {
      return (
        <LogDetail
          key={key}
          action={logDatas[key].action}
          batchorOrder={
            logDatas[key].batch !== "N/A"
              ? logDatas[key].batch
              : logDatas[key].order
          }
          user={logDatas[key].user}
          date={logDatas[key].date}
          picker={logDatas[key].picker}
          shipper={logDatas[key].shipper}
        />
      );
    })
    .reverse();
};


export default LogList;
