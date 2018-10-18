import React from 'react';
import { Segment, Button, Form } from 'semantic-ui-react';
import axios from 'axios';
import people from '../../config/people';
import shipstation from '../../config/auth';

class BatchOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {batchNumber: '', picker: '', shipper: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => this.setState({[e.target.name]: e.target.value});

    handleSelectChange = (e, data) => this.setState({[data.name]: data.value});

    handleSubmit(event) {
        axios.get('https://ssapi.shipstation.com/shipments', {
            params: {
                ID: shipstation.user,
                password: shipstation.key
            }
        }).then(response => console.log(response))
        var request = new XMLHttpRequest();
        request.open('GET', 'https://ssapi.shipstation.com/shipments');
        const encodedString = new Buffer(shipstation.user + ':' + shipstation.key).toString('base64');
        request.setRequestHeader('Authorization', 'Basic ' + encodedString);

        request.onreadystatechange = function () {
        if (this.readyState === 4) {
            console.log('Status:', this.status);
            console.log('Headers:', this.getAllResponseHeaders());
            console.log('Body:', this.responseText);
        }
        };

        request.send();

        console.log(request);
    }
    render() {
        return (
            <Segment color='olive' padded='very'>
                <Form size='large' onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <Form.Input fluid label='Batch Number' placeholder='123456' name='batchNumber' value={this.state.batchNumber} onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Group widths='equal'>
                            <Form.Select label='Picker' placeholder='Select One' name='picker' options={people} onChange={this.handleSelectChange} />
                            <Form.Select label='Shipper' placeholder='Select One' name='shipper' options={people} onChange={this.handleSelectChange} />
                    </Form.Group>
                    <Button size='large' color='olive' type='submit'>Generate Batch</Button>
                </Form>
            </Segment>
        )
    }
}


export default BatchOrders;