import React, { Component } from "react";
import { Button, Segment, Grid, Header, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import MediaQuery from "react-responsive";

class Scanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id) {
    this.setState({ loading: true });
    let path = "";
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
      pathname: path
    });
  }

  render() {
    let buttons = [
      {
        id: 0,
        icon: "clipboard outline",
        name: "Report Scan",
        color: "teal",
        show: true
      },
      { id: 1, icon: "zip", name: "Inbound Scan", color: "blue", show: true },
      {
        id: 2,
        icon: "broken chain",
        name: "Open Broken Scan",
        color: "orange",
        show: true
      },
      {
        id: 3,
        icon: "fly",
        name: "Baby Care Scan",
        color: "yellow",
        show: true
      },
      { id: 4, icon: "tag", name: "Toy Scan", color: "red", show: true },
      { id: 5, icon: "tv", name: "Return Scan", color: "green", show: true }
    ];

    return (
      <div>
        <MediaQuery maxWidth={374}>
          <Header color="olive">
            Inventory Scanning
          </Header>
          <Grid columns={2}>
            {buttons.map(button => {
              if (button.show) {
                return (
                  <Grid.Column
                    key={button.name}
                    stretched
                    style={{ padding: "0", textAlign: "center" }}
                  >
                    <Button
                      key={button.name}
                      style={{
                        padding: 0,
                        height: "100px"
                      }}
                      fluid
                      color={button.color}
                      onClick={() => this.handleClick(button.id)}
                    >
                      <Icon
                        size="large"
                        style={{ margin: "8px -0.571429em 15px -0.214286em" }}
                        name={button.icon}
                      />{" "}
                      <br />
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
          <Segment color="blue">
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
          </Segment>
        </MediaQuery>
      </div>
    );
  }
}

export default withRouter(Scanning);
