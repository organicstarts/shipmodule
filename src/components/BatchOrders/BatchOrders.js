import React, { Component } from 'react';
import { Segment, Button, Form } from 'semantic-ui-react';
import people from '../../config/people';

class BatchOrders extends Component {
    //constructor(props) {
    //    super(props);
    //}

    process(event) {

    }
    render() {
        return (
            <Segment color='olive' padded='very'>
                <Form onSubmit={this.process}>
                    <Form.Field>
                        <Form.Input fluid label='Batch Number' placeholder='123456' />
                    </Form.Field>
                    <Form.Group widths='equal'>
                        <Form.Select label='Picker' placeholder='Select One' options={people} />
                        <Form.Select label='Shipper' placeholder='Select One' options={people} />
                    </Form.Group>
                    <Button size='large' color="olive" >Generate Batch</Button>
                </Form>
            </Segment>
        )
    }
}


export default BatchOrders;