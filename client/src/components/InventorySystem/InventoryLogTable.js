import React, { Component } from "react";
import InventoryDetail from "./InventoryDetail";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import firebase from "../../config/firebaseconf";
import { Segment, Table } from "semantic-ui-react";

class InventoryLogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: {},
      loading: true
    };
  }

  componentDidMount() {
    this.firebaseRef = firebase.database().ref(`/inventory`);
    this.firebaseRef
      .on("value", async snapshot => {
        const payload = snapshot.val();
        if (payload.log) {
          this.setState({
            datas: payload.log
          });
          let storageRef = firebase.storage().ref();

          Object.keys(payload.log).forEach(key => {
            storageRef
              .child(`images/${payload.log[key].trackingNumber}`)
              .getDownloadURL()
              .then(url => {
                payload.log[key].image = url;
                this.setState({ loading: false });
              })
              .catch(err => {
                console.log("file not found!");
              });
          });
        }
      })
      .bind(this);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  mapTableList() {
    const { datas } = this.state;
    return Object.keys(datas)
      .map(key => {
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
            image={datas[key].image ? datas[key].image : ""}
          />
        );
      })
      .reverse();
  }

  renderLogList() {
    if (this.state.loading) {
      return (
        <ClipLoader
          sizeUnit={"px"}
          size={54}
          color={"#36D7B7"}
          loading={this.state.loading}
        />
      );
    }

    return (
      <Table celled collapsing textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <strong>Tracking #</strong>
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
            <Table.HeaderCell>
              <strong>Invoice</strong>
            </Table.HeaderCell>
            <Table.HeaderCell>
              <strong>Date</strong>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {this.mapTableList()}
      </Table>
    );
  }

  render() {
    return (
      <Segment compact style={{ margin: "50px auto" }}>
        <Link to="/" className="noprint">
          Go Back
        </Link>{" "}
        <br />
        {this.renderLogList()}
      </Segment>
    );
  }
}

export default InventoryLogTable;
