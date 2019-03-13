import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Segment, Grid, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class Inventory extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  compareEmail(email) {
    switch (email) {
      case "yvan@organicstart.com":
      case "peter@organicstart.com":
      case "isaiah@organicstart.com":
        return true;
      default:
        return false;
    }
  }
  handleClick(id) {
    let path = "";
    let warehouse = "";
    switch (id) {
      case 1:
        path = "/inventoryReport";
        warehouse = "eastcoastReport";
        break;
      case 2:
        path = "/inventoryReport";
        warehouse = "westcoastReport";
        break;
      case 3:
        path = "/openBrokenTable";
        break;
      case 4:
        path = "/inventoryTable";
        break;
      case 5:
        path = "/inboundLogTable";
        break;
      case 6:
        path = "/archiveLogTable";
        break;
      default:
        path = "/";
        break;
    }

    this.props.history.push({
      pathname: path,
      state: { warehouse: warehouse ? warehouse : "" }
    });
  }

  render() {
    let buttons = [
      {
        id: 1,
        name: "East Coast Reporting Table",
        color: "twitter",
        show: true,
        icon: "warehouse"
      },
      {
        id: 2,
        name: "West Coast Reporting Table",
        color: "vk",
        show: true,
        icon: "warehouse"
      },
      {
        id: 3,
        name: "View Open/Broken Inventory",
        color: "google plus",
        show: true,
        icon: "dolly"
      },
      {
        id: 4,
        name: "View Inventory",
        color: "orange",
        show:  true,
        icon: "dolly flatbed"
      },
      {
        id: 5,
        name: "View Inbound Inventory Log",
        color: "teal",
        show: this.compareEmail(this.props.email) ? true : false,
        icon: "boxes"
      },
      {
        id: 6,
        name: "View Archive Inbound Log",
        color: "facebook",
        show: this.compareEmail(this.props.email) ? true : false,
        icon: "pallet"
      }
    ];

    return (
      <Segment color="blue" padded="very">
        <Grid columns={2} stackable>
          {buttons.map(button => {
            if (button.show) {
              return (
                <Grid.Column
                  key={button.name}
                  stretched
                  style={{ textAlign: "center" }}
                >
                  <Button
                    key={button.id}
                    fluid
                    style={{ marginBottom: "15px" }}
                    size="large"
                    color={button.color}
                    onClick={() => this.handleClick(button.id)}
                  >
                    <Icon
                      size="massive"
                      style={{ margin: "25px auto" }}
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
      </Segment>
    );
  }
}

function mapStateToProps({ authState }) {
  return {
    email: authState.email
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Inventory)
);
