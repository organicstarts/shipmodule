import React from 'react';
import { Segment, Button, Form } from 'semantic-ui-react';
import people from '../../config/people';
import * as config from '../../config/auth';

class BatchOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = { batchNumber: '', picker: '', shipper: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

    handleSelectChange = (e, data) => this.setState({ [data.name]: data.value });

    handleSubmit(event) {

        const encodedString = new Buffer(`${config.shipstation.user}:${config.shipstation.key}`).toString('base64');

        const requestOptions = {
            method: 'GET',
            headers: { 
                "Access-Control-Allow-Origin": "*", 
                "Authorization": `Basic ${encodedString}` 
            }
        };

        return fetch('https://ssapi.shipstation.com/shipments', requestOptions)
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(function (responseAsJson) {
                console.log(responseAsJson);
            })
            .catch(function (error) {
                console.log('Looks like there was a problem: \n', error);
            });
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