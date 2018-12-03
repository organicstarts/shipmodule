import React from "react";

const LogDetail = props => {
  return (
    <tbody>
      <tr>
        <td style={styles.border}>{props.action}</td>
        <td style={styles.border}>{props.date}</td>
        <td style={styles.border}>{props.user}</td>
        <td style={styles.border}>{props.batchorOrder}</td>
        <td style={styles.border}>{props.picker}</td>
        <td style={styles.borderLast}>{props.shipper}</td>
      </tr>
    </tbody>
  );
};

export default LogDetail;

const styles = {
  border: {
    borderBottom: "1px solid #ccc",
    borderRight: "1px solid #ccc",
    borderCollapse: "separate",
    borderSpacing: "4px"
  },
  borderLast: {
    borderBottom: "1px solid #ccc",
    borderCollapse: "separate",
    borderSpacing: "4px"
  }
};
