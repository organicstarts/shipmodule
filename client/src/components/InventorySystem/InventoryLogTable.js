import React, { Component } from "react";
import InventoryDetail from "./InventoryDetail";
import { Link } from "react-router-dom";
import firebase from "../../config/firebaseconf";
import { Segment, Table } from "semantic-ui-react";

class InventoryLogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: []
    };
    this.firebaseRef = firebase.database().ref(`/inventory`);
    this.firebaseRef
      .on("value", snapshot => {
        const payload = snapshot.val();
        if (payload) {
          this.setState({
            datas: payload.log
          });
        }
      })
      .bind(this);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  renderLogList() {
    const { datas } = this.state;
    return Object.keys(datas).map(key => {
      return (
        <InventoryDetail
          key={key}
          trackingNumber={datas[key].trackingNumber}
          brand={datas[key].brand}
          stage={datas[key].stage}
          quantity={datas[key].quantity}
          broken={datas[key].broken}
          total={datas[key].total}
          scanner={datas[key].scanner}
          timeStamp={datas[key].timeStamp}
          warehouseLocation={datas[key].warehouseLocation}
        />
      );
    }).reverse();
  }

  render() {
    return (
      <Segment style={{ marginTop: "50px" }}>
        <Link to="/" className="noprint">
          Go Back
        </Link>
        <Table celled textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <strong>Tracking #</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Date</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Brand</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Stage</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Quantity</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Broken</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Total</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Scanner</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Warehouse</strong>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          {this.renderLogList()}
        </Table>
      </Segment>
    );
  }
}

export default InventoryLogTable;
