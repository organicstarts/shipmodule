import React from "react";
import Datamap from "./DataMap";
import Map from "./Map";

class USmap extends React.Component {
  render() {
    return (
      <Map label={this.props.eastLabel} label2={this.props.westLabel}>
        <Datamap
          scope="usa"
          geographyConfig={{
            highlightBorderColor: "#bada55",
            popupTemplate: (geography, data) =>
              `<div class='hoverinfo'>${
                geography.properties.name
              }\nShipped Count: ${data.data}`,
            highlightBorderWidth: 3
          }}
          fills={{
            east: "#cc4731",
            west: "#306596",
            defaultFill: "#eddc4e"
          }}
          data={this.props.data}
          labels
        />
      </Map>
    );
  }
}
export default USmap;
