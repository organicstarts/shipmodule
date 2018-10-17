import React, { Component } from 'react';
import { Segment, Button, Form } from 'semantic-ui-react';
import './BatchOrders.css';

class BatchOrders extends Component {
    //constructor(props) { Generating a warning that this is not necessary?
    //    super(props);
    //}

    render() {
        return (
            <Segment color='olive' padded='very'>
                <Form>
                    <Form.Field>
                        <Form.Input fluid label='Batch Number' placeholder='123456' />
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Select label='Picker' placeholder='Select One' options={options} />
                        <Form.Select label='Shipper' placeholder='Select One' options={options} />
                    </Form.Group>
                    <Button size='large' color="olive">Generate Batch</Button>
                </Form>
            </Segment>
        )
    }
}

const options = [
    { key: '1', text: 'Jonathan', value: 'jonathan' },
    { key: '2', text: 'Julian', value: 'julian' },
    { key: '3', text: 'Luis', value: 'luis' },
    { key: '4', text: 'Steve', value: 'steve' },
    { key: '5', text: 'David', value: 'david' },
    { key: '5', text: 'Richard', value: 'richard' },
    { key: '5', text: 'Romario', value: 'romario' },
    { key: '6', text: 'Training', value: 'training' },
  ]


export default BatchOrders;