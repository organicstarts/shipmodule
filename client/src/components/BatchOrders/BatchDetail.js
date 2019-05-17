import React from "react";

const BatchDetail = props => {
  return (
    <div
      style={
        props.fullBox
          ? { padding: "15px" }
          : { borderBottom: "2px dotted gray", padding: "15px" }
      }
    >
      <div className="row align-items-center">
        <div className="col-2">
          <div className="checkbox" style={styles.checkboxStyle} />
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
        <div className="col-1" style={{ textAlign: "center" }}>
          {props.warehouse}
        </div>
        <div className="col-6">{`${props.text} ${
          props.options ? props.options : ""
        }`}</div>
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
        <div className="row alt" style={styles.color1}>
          <div className="col-4" />
          <div className="col-7">
            {props.sku.includes("PRMX") ? "6 PACKS" : "FULL BOXES"}
          </div>
          <div className="col-1" style={{ textAlign: "center" }}>
            {props.fullBox}
          </div>
        </div>
      ) : (
        ""
      )}
      {props.loose ? (
        <div className="row alt" style={styles.color2}>
          <div className="col-4" />
          <div className="col-7">LOOSE</div>
          <div className="col-1" style={{ textAlign: "center" }}>
            {props.loose}
          </div>
        </div>
      ) : (
        ""
      )}
      {(props.fullBox || props.loose) && !props.sku.includes("PRMX") ? (
        <div>
          <div className="row alt" style={styles.total}>
            <div className="col-4" />
            <div className="col-7">TOTAL</div>
            <div className="col-1" style={{ textAlign: "center" }}>
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
    minHeight: "55px",
    width: "auto",
    margin: "0 auto"
  },
  checkboxStyle: {
    border: "1px solid #ccc",
    height: "30px",
    width: "30px",
    float: "left"
  },
  color1: {
    marginTop: "15px",
    backgroundColor: "#ccc",
    padding: "15px",
    borderBottom: ".5px solid #a6a6a6"
  },
  color2: {
    backgroundColor: "#ccc",
    padding: "15px",
    borderBottom: ".5px solid #a6a6a6"
  },
  total: {
    padding: "15px",
    backgroundColor: "#ccc"
  },
  border: {
    height: "10px",
    backgroundColor: "white",
    borderBottom: "2px dotted gray"
  }
};
export default BatchDetail;
