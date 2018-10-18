import React from 'react';
import { Segment, Button, Form } from 'semantic-ui-react';

class FetchOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {orderNumber: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => this.setState({[e.target.name]: e.target.value});

    handleSubmit(event) {

    }
    render() {
        return (
            <Segment color='yellow' padded='very'>
                <Form size='large' onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <Form.Input fluid label='Order Number' placeholder='123456' name='orderNumber' value={this.state.orderNumber} onChange={this.handleChange} />
                    </Form.Field>
                    <Button size='large' color='yellow'>Fetch Order</Button>
                </Form>
            </Segment>
        );
    }
}

export default FetchOrder;