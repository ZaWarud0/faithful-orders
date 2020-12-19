import React, { useState } from 'react';

import { Segment, Divider, Icon, Button } from 'semantic-ui-react';

const ListItem = ({name, number, items, orderedAt, onFulfill}) => 
{
    const [visible, setVisible] = useState(false);

    return(
        <Segment padded color="olive">
            <div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div>
                        <div style={{fontSize: '1.2em', fontWeight: 'bold', paddingBottom: '3px'}}>{name}</div>
                        <div style={{fontSize: '.9em', fontWeight: '400'}}>{number}</div>
                    </div>
                    <Button onClick={onFulfill} style={{marginLeft: '15px'}} color="olive" size="mini">Fulfilled</Button>
                </div>
                <Divider />

                <div style={{display: `${visible ? 'block' : 'none'}`}}>
                    <div style={{fontWeight: 'bold'}}>Ordered Items: </div>
                    <ul style={{marginTop: '7px'}}>
                        {items && items.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </div>

                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{fontWeight: 'bold', fontSize: '.8em'}}>
                        Order Placed: <span style={{fontWeight: '600'}}>{orderedAt.toLocaleDateString("en-GB", {day: 'numeric', month: 'long'}) + " at " +orderedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div>
                        <Icon onClick={() => setVisible(!visible)} name={`chevron ${visible ? 'up' : 'down'}`} />
                    </div>
                </div>
            </div>
        </Segment>
    )
}

export default ListItem;