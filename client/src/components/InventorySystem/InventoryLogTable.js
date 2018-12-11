import React, { Component } from "react";
import InventoryDetail from "./InventoryDetail";
import { Link } from "react-router-dom";
import firebase from "../../config/firebaseconf";
import { Segment, Table } from "semantic-ui-react";

class InventoryLogTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datas: {},
      image: 0
    };
  }
  componentDidMount() {
    this.firebaseRef = firebase.database().ref(`/inventory`);
    this.firebaseRef
      .on("value", snapshot => {
        const payload = snapshot.val();
        if (payload) {
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
                this.setState({ image: url });
              });
          });
        }
      })
      .bind(this);
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.image !== nextState.image;
  }

  renderLogList() {
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
            image={datas[key].image}
          />
        );
      })
      .reverse();
  }

  render() {
    return (
      <Segment compact style={{ margin: "50px auto" }}>
        <Link to="/" className="noprint">
          Go Back
        </Link>
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
                <strong>invoic</strong>
              </Table.HeaderCell>
              <Table.HeaderCell>
                <strong>Date</strong>
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
