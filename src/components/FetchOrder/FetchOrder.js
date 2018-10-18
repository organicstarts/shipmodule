import React from 'react';
import { Segment, Button, Form } from 'semantic-ui-react';

const FetchOrder = () => {
    return (
        <Segment color='yellow' padded='very'>
            <Form size='large'>
                <Form.Field>
                    <Form.Input fluid label='Order Number: ' placeholder='123456' />
                </Form.Field>
                <Button size='large' color='yellow'>Fetch Order</Button>
            </Form>
        </Segment>
    );
}

export default FetchOrder;