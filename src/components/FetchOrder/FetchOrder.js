import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import './FetchOrder.css';

const FetchOrder = () => {
    return (
        <div className="size gradient-orange center ma3 pa3 tc">
        <Form>
            <Form.Input fluid label='Order Number: ' placeholder='#123871238912' error />
            <Button color="orange">Fetch Order</Button>
        </Form>
    </div>
    );
}

export default FetchOrder;