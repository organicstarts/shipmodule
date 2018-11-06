import React from 'react';

const BatchDetail = (props) => {
    return (
        <div className="row">
            <div className="col-lg-4">
                <img src={props.image} alt="product image" />
            </div>
            <h1>
                {props.text}
            </h1>
            <h1>{props.quantity}</h1> 
            <div><h1>{props.sku}</h1></div>
        </div>
    );
}

export default BatchDetail;