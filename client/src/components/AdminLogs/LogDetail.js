import React from "react";

const LogDetail = props => {
  return (
    <tbody >
      <tr >
        <td>{props.date}</td>
        <td>{props.batch}</td>
        <td>{props.picker}</td>
        <td>{props.shipper}</td>
      </tr>
    </tbody>
  );
};

export default LogDetail;
