import PropTypes from "prop-types";
import React from "react";
import "./screen.css";
class Map extends React.Component {
  static propTypes = {
    additionalClasses: PropTypes.string,
    children: PropTypes.element.isRequired,

    mapStyle: PropTypes.object
  };

  render() {
    return (
      <div>
        <h4 className="label">
          <strong>Shipping Map: East v. West</strong>
        </h4>
        <div className="Map-label">
          {this.props.label} {this.props.label2}{" "}
        </div>
        <div className="Map">
          <div
            className={`Map-map ${this.props.additionalClasses}`}
            style={this.props.mapStyle}
          >
            {React.Children.only(this.props.children)}
          </div>
        </div>
      </div>
    );
  }
}

export default Map;
