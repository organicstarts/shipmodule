import React from "react";

const BatchDetail = props => {
  return (
    <div
      style={
        props.fullBox
          ? { paddingTop: "25px" }
          : { borderBottom: "2px dotted gray", paddingTop: "25px" }
      }
    >
      <div className="row">
        <div className="col-1" style={styles.padding}>
          <div className="checkbox" style={styles.checkboxStyle} />
        </div>
        <div className="col-1">
          <img
            src={props.image}
            className="img-fluid"
            style={styles.imageStyle}
            alt="product"
          />
        </div>
        <div className="col-2" style={{ textAlign: "center" }}>
          {props.warehouse}
        </div>
        <div className="col-6">{props.text}</div>
        <div className="col-1" style={{ textAlign: "center" }} />
        {!props.fullBox && !props.loose ? (
          <div className="col-1" style={{ textAlign: "center" }}>
            {props.quantity}
          </div>
        ) : (
          ""
        )}
      </div>
      {props.fullBox ? (
        <div className="row alt" style={styles.color}>
          <div className="col-4" />
          <div className="col-7">FULL BOXES</div>
          <div className="col-1" style={{ textAlign: "right"  }}>
            {props.fullBox}
          </div>
        </div>
      ) : (
        ""
      )}
      {props.loose ? (
        <div className="row alt" style={styles.color}>
          <div className="col-4" />
          <div className="col-7">LOOSE</div>
          <div className="col-1" style={{ textAlign: "right" }}>
            {props.loose}
          </div>
        </div>
      ) : (
        ""
      )}
      {props.fullBox || props.loose ? (
        <div>
          <div className="row alt" style={styles.total}>
            <div className="col-4" />
            <div className="col-7">TOTAL</div>
            <div className="col-1" style={{ textAlign: "right" }}>
              {props.quantity}
            </div>
          </div>
          <div style={styles.border} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

const styles = {
  imageStyle: {
    maxHeight: "55px",
    margin: "0 auto"
  },
  checkboxStyle: {
    border: "1px solid #ccc",
    height: "30px"
  },
  padding: {
    padding: "15px"
  },
  color: {
    backgroundColor: "#ccc",
    marginLeft: "0",
    marginRight: "0",
    borderBottom: ".5px solid #a6a6a6"
  },
  total: {
    marginLeft: "0",
    marginRight: "0",
    backgroundColor: "#ccc"
  },
  border: {
    height: "10px",
    backgroundColor: "white",
    borderBottom: "2px dotted gray"
  }
};
export default BatchDetail;
