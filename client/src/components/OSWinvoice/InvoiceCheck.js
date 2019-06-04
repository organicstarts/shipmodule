import React, { Component } from "react";
import CSVReader from "react-csv-reader";
import { Segment, Table, Progress, Icon, Header } from "semantic-ui-react";
import axios from "axios";


class InvoiceCheck extends Component {
  constructor() {
    super();
    this.state = {
      report: [],
      show: false,
      loading: false,
      percent: 0
    };
    this.fileHandler = this.fileHandler.bind(this);
  }
  async calculateOrderNumber(item) {
    let arrItem = [];
    let count = 0;
    for (let i = 5; i < item.length; i++) {
      if (item[i] !== "") {
        count = count += 1;
        await axios
          .get(`ss/getsingleosworder?orderNumber=${item[i]}`)
          .then(data => arrItem.push(data.data));
      }
    }

    return arrItem.map(data => {
      let reg1 = /(PRE|\d)\/\d/;
      let reg2 = /(\d.\/\d. pieces)/;
      if (
        data.quantity === item[2] / count &&
        (reg1.test(item[0]) && !reg2.test(item[0]))
          ? item[0].includes(data.pcs * 2)
          : item[0].includes(data.pcs)
      ) {
        return (
          <span key={data.orderNumber} style={{ backgroundColor: "green" }}>
            {data.orderNumber},{" "}
          </span>
        );
      } else {
        return (
          <span key={data.orderNumber} style={{ backgroundColor: "red" }}>
            {data.orderNumber},{" "}
          </span>
        );
      }
    });
  }
  fileHandler = async data => {
    this.setState({ loading: true, show: false, percent: 0 });
    let reportHtml = [];
    for (let i = 4; i < data.length - 5; i += 2) {
      if (data[i][2] !== "") {
        reportHtml.push(
          <Table.Row key={i}>
            <Table.Cell>{data[i][0]}</Table.Cell>
            <Table.Cell>{data[i][1]}</Table.Cell>
            <Table.Cell>{data[i][2]}</Table.Cell>
            <Table.Cell>{data[i][3]}</Table.Cell>
            <Table.Cell>{data[i][4]}</Table.Cell>
            <Table.Cell>
              {await this.calculateOrderNumber(data[i])}
              {/* <span style={{ backgroundColor: "red" }}>{data[i][5]}</span>{" "}
              {data[i][6]} {data[i][7]} {data[i][8]} {data[i][9]} */}
            </Table.Cell>
          </Table.Row>
        );
      }
      this.setState({ percent: parseInt((i / data.length) * 100) });
    }
    this.setState({
      show: true,
      report: reportHtml,
      percent: 100,
      loading: false
    });
  };

  renderTableRow() {
    return this.state.report;
  }

  render() {
    return (
      <div>
        <Header as="h1">
          <Icon name="list" />
          <Header.Content>Check Invoice for OSW</Header.Content>
        </Header>

        <Segment>
          <CSVReader
            cssClass="react-csv-input noprint"
            label="Select CSV file: "
            onFileLoaded={this.fileHandler}
          />
          {this.state.loading && (
            <Progress
              className="noprint"
              style={{ marginTop: "10px" }}
              percent={this.state.percent}
              indicating
              progress
            />
          )}
          {this.state.show ? (
            <Table celled collapsing textAlign="left">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <strong>Item Name</strong>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <strong>Unit Price</strong>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <strong>Quantity</strong>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <strong>VAT %</strong>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <strong>Total excl. VAT</strong>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <strong>Order Numbers</strong>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{this.renderTableRow()}</Table.Body>
            </Table>
          ) : (
            ""
          )}
        </Segment>
      </div>
    );
  }
}

export default InvoiceCheck;
