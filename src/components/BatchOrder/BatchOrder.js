import React, { Component } from 'react';
import { Button, Form } from 'semantic-ui-react'
import './BatchOrder.css';

class BatchOrder extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="size center gradient-blue ma3 pa3 tc">
                <Form>
                    <Form.Input fluid label='Batch Number: ' placeholder='#123871238912' error />
                    <Form.Group widths='equal'>
                        <Form.Select label='Picked By: ' options={options} placeholder='Picked By' error />
                        <Form.Select label='Shipped By: ' options={options} placeholder='Shipped By' error />
                    </Form.Group>
                    <Button color="blue">Generate Batch</Button>
                </Form>
            </div>
        )
    }
}

const options = [
    { key: '1', text: 'Person 1', value: 'Person 1' },
    { key: '2', text: 'Person 2', value: 'Person 2' },
    { key: '3', text: 'Person 3', value: 'Person 3' },
    { key: '4', text: 'Person 4', value: 'Person 4' },
    { key: '5', text: 'Person 5', value: 'Person 5' },
    { key: '6', text: 'Person 6', value: 'Person 6' },
  ]


export default BatchOrder;
