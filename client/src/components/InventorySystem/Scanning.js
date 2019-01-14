import React, { Component } from "react";
import { Button, Segment, Grid, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import MediaQuery from "react-responsive";

class Scanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: this.props.displayName,
      email: this.props.email
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id) {
    this.setState({ loading: true });
    let path = "";
    let warehouse = "";
    switch (id) {
      case 0: {
        path = "reportLogging";
        break;
      }
      case 1:
        path = "/inboundLogging";
        break;
      case 2:
        path = "/obReportLogging";
        break;
      case 3:
        path = "/babycareLogging";
        break;
      case 4:
        path = "/toyLogging";
        break;
        case 5:
        path = "/returnLogging";
        break;
      default:
        path = "/";
        break;
    }

    this.props.history.push({
      pathname: path,
      state: { detail: this.state, warehouse: warehouse ? warehouse : "" }
    });
  }

  render() {
    let buttons = [
      { id: 0, name: "Report Scan", color: "teal", show: true },
      { id: 1, name: "Inbound Scan", color: "blue", show: true },
      { id: 2, name: "Open Broken Scan", color: "orange", show: true },
      { id: 3, name: "Baby Care Scan", color: "yellow", show: true },
      { id: 4, name: "Toy Scan", color: "red", show: true },
      { id: 5, name: "Return Scan", color: "green", show: true }
    ];

    return (
      <Segment color="blue" padded={window.innerWidth > 374 ? "very" : null}>
        <MediaQuery maxWidth={374}>
          <Header color="olive" block>
            Inventory Scanning
          </Header>
          <Grid columns={2}>
            {buttons.map(button => {
              if (button.show) {
                return (
                  <Grid.Column key={button.name}>
                    <Button
                      key={button.name}
                      circular
                      style={{
                        padding: 0,
                        margin: "15px auto",
                        width: "100px",
                        height: "100px"
                      }}
                      color={button.color}
                      onClick={() => this.handleClick(button.id)}
                    >
                      {button.name}
                    </Button>
                  </Grid.Column>
                );
              } else {
                return "";
              }
            })}
          </Grid>
        </MediaQuery>
        <MediaQuery minWidth={374}>
          {buttons.map(button => {
            if (button.show) {
              return (
                <Button
                  key={button.id}
                  fluid
                  style={{ marginBottom: "15px" }}
                  size="large"
                  color={button.color}
                  onClick={() => this.handleClick(button.id)}
                >
                  {button.name}
                </Button>
              );
            } else {
              return "";
            }
          })}
        </MediaQuery>
      </Segment>
    );
  }
}

export default withRouter(Scanning);
