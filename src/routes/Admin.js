import React, { useState, useEffect } from 'react';

import { Container, Segment, Table, Button, Divider, Loader } from 'semantic-ui-react';

import { firestore } from '../firebase'; 
import Title from '../components/Title';
import ListItem from '../components/ListItem';
// import './Order.css';

const Admin = () =>
{
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const unsub = firestore.collection("orders").orderBy('orderedAt', 'desc')
            .onSnapshot(snap => {
                let tempOrders = [];
                snap.forEach(order => {
                    tempOrders.push({
                        id: order.id,
                        name: order.data().name,
                        number: order.data().number,
                        items: order.data().items,
                        status: order.data().status,
                        orderedAt: order.data().orderedAt.toDate()
                     })
                })
                setOrders(tempOrders);
                setLoading(false);
            })
        
        return () => {
            unsub();
        }

    }, [])

    const onOrderComplete = (index) =>
    {   
        setLoading(true);

        const completedOrder = orders[index];
        let tempOrders = [...orders];
        tempOrders.splice(index, 1);

        firestore.collection("orders").doc(completedOrder.id).delete()
            .then(() => {
                setLoading(false);
                setOrders(tempOrders);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
            })
    }


    const renderTableRows = () =>
    {
        return orders.map((order, index) => {
            return(
                <Table.Row key={index}>
                    <Table.Cell>{order.name}</Table.Cell>
                    <Table.Cell>{order.number}</Table.Cell>
                    <Table.Cell>{order.items.map(item => item[0].toUpperCase() + item.slice(1)).join(", ")}</Table.Cell>
                    <Table.Cell>{order.orderedAt.toLocaleDateString("en-GB", {day: 'numeric', month: 'long'}) + " at " + order.orderedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Table.Cell>
                    <Table.Cell><Button onClick={() => onOrderComplete(index)} color="olive" size="small">Order Fulfilled</Button></Table.Cell>
                </Table.Row>  
            ) 
        })
    }

    const renderList = () =>
    {
        return orders.map((order, index) => {
            return(
                <ListItem onFulfill={() => onOrderComplete(index)} key={index} name={order.name} number={order.number} items={order.items} orderedAt={order.orderedAt} /> 
            ) 
        })
    }

    const renderEmpty = () =>
    {
        return(
            <Table.Row>
                <Table.Cell colSpan="6" >
                    <div style={{display: 'flex', justifyContent: 'center', fontWeight: 'bold', paddingTop: '6%'}}>
                        All Orders Dealt With <span style={{marginLeft: '5px', fontSize: '1.2em'}} aria-label="happy face" role="img">&#128522;</span>
                    </div>
                </Table.Cell>
            </Table.Row>
        )
    }

    return(
        <div className="app-container">
                <div className="form-container m-display">
                    <Container>
                        <Title title="Faithful" sub="Latest Orders" />
                        <Segment loading={loading} style={{overflow: 'auto', maxHeight: '70vh'}} padded raised color="olive" size="big">
                            <Table basic="very" celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Name</Table.HeaderCell>
                                        <Table.HeaderCell>Number</Table.HeaderCell>
                                        <Table.HeaderCell>Ordered Items</Table.HeaderCell>
                                        <Table.HeaderCell>Ordered At</Table.HeaderCell>

                                    </Table.Row>
                                </Table.Header>
                            
                                <Table.Body>
                                    {!loading && orders.length === 0 ? renderEmpty() : renderTableRows()}
                                </Table.Body>
                            </Table>
                        </Segment>
                    </Container>
                </div>
            <div style={{paddingTop: '5%'}} className="sm-display">
                <Container>
                    <Title title="Faithful" sub="Latest Orders" />
                    {!loading && orders.length === 0 ? 
                        <>
                            <Divider />
                            <div style={{display: 'flex', justifyContent: 'center', fontWeight: 'bold', paddingTop: '6%'}}>
                                All Orders Dealt With <span style={{marginLeft: '5px', fontSize: '1.2em'}} aria-label="happy face" role="img">&#128522;</span>
                            </div> 
                        </>
                    : renderList()}
                    <Loader active={loading} />
                </Container>
            </div>
        </div>
    )
}

export default Admin;