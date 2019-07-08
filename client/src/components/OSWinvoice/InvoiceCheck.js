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
      percent: 0,
      invoiceTotal: 0,
      calculatedTotal: 0
    };
    this.fileHandler = this.fileHandler.bind(this);
  }
  async calculateOrderNumber(item, itemCompare) {
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
    for (let i = 5; i < itemCompare.length; i++) {
      if (itemCompare[i] !== "") {
        count = count += 1;
      }
    }

    return arrItem.map(data => {
      let reg1 = /(PRE|pre|OS|\d)\/(\d|PRE|OS|pre)/;
      let reg2 = /(\d.\/\d. pieces)/;

      if (item[0].includes("Shipping")) {
        if (
          data.quantity === itemCompare[2] / count &&
          (reg1.test(itemCompare[0]) && !reg2.test(itemCompare[0])
            ? itemCompare[0].includes(data.pcs * 2)
            : itemCompare[0].includes(data.pcs))
        ) {
          return (
            <span
              key={data.orderNumber + Math.random()}
              style={{ backgroundColor: "green" }}
            >
              {data.orderNumber},{" "}
            </span>
          );
        } else {
          return (
            <span
              key={data.orderNumber + Math.random()}
              style={{ backgroundColor: "red" }}
            >
              {data.orderNumber},{" "}
            </span>
          );
        }
      }
      if (
        data.quantity === item[2] / count &&
        (reg1.test(item[0]) && !reg2.test(item[0])
          ? item[0].includes(data.pcs * 2)
          : item[0].includes(data.pcs))
      ) {
        return (
          <span
            key={data.orderNumber + Math.random()}
            style={{ backgroundColor: "green" }}
          >
            {data.orderNumber},{" "}
          </span>
        );
      } else {
        return (
          <span
            key={data.orderNumber + Math.random()}
            style={{ backgroundColor: "red" }}
          >
            {data.orderNumber},{" "}
          </span>
        );
      }
    });
  }
  fileHandler = async data => {
    this.setState({ loading: true, show: false, percent: 0 });
    let reportHtml = [];
    let tempTotal = data[data.length - 3][4].split("€  ")[1];
    let total = parseFloat(tempTotal.replace(/,/g, ""));
    let individualTotal = 0;
    for (let i = 4; i < data.length - 5; i += 2) {
      if (data[i][2] !== "") {
        let line2 = data[i + 1][2] !== "" ? true : false;
        individualTotal = data[i][2].includes("-")
          ? individualTotal -
            parseFloat(data[i][4].split("€  ")[1].replace(/,|\(|\)/g, "")) -
            (line2
              ? parseFloat(
                  data[i + 1][4].split("€  ")[1].replace(/,|\(|\)/g, "")
                )
              : 0)
          : individualTotal +
            parseFloat(data[i][4].split("€  ")[1].replace(/,|\(|\)/g, "")) +
            (line2
              ? parseFloat(
                  data[i + 1][4].split("€  ")[1].replace(/,|\(|\)/g, "")
                )
              : 0);
        reportHtml.push(
          <Table.Row key={i}>
            <Table.Cell>
              {data[i][0]} <br /> {line2 ? data[i + 1][0] : ""}
            </Table.Cell>
            <Table.Cell>
              {data[i][1]}
              <br /> {line2 ? data[i + 1][1] : ""}
            </Table.Cell>
            <Table.Cell>
              {data[i][2]}
              <br /> {line2 ? data[i + 1][2] : ""}
            </Table.Cell>
            <Table.Cell>
              {data[i][3]}
              <br /> {line2 ? data[i + 1][3] : ""}
            </Table.Cell>
            <Table.Cell>
              {data[i][4]}
              <br /> {line2 ? data[i + 1][4] : ""}
            </Table.Cell>
            <Table.Cell>
              {await this.calculateOrderNumber(data[i], data[i + 1])} <br />
              {line2
                ? await this.calculateOrderNumber(data[i + 1], data[i])
                : ""}
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
      loading: false,
      invoiceTotal: total,
      calculatedTotal: individualTotal
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
              <Table.Body>
                {this.renderTableRow()}

                <Table.Row>
                  <Table.HeaderCell>
                    <Header floated="right">
                      <strong>TOTAL:</strong>
                      {"  € "}
                      {this.state.invoiceTotal}
                    </Header>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Header floated="right">
                      <strong>CALCULATED TOTAL:</strong>
                      {"  € "}
                      {this.state.calculatedTotal}
                    </Header>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Body>
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
