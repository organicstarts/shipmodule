import React from 'react';
import { Button } from 'semantic-ui-react';
import './FraudOrders.css';

const FraudOrders = () => {
    return (
        <div className="center">
            <Button fluid color="red">Search for Fraudulent Orders</Button>
        </div>
    );
}

export default FraudOrders;