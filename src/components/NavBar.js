import React, { useState, useContext, useEffect } from 'react'

import { withRouter } from 'react-router';
import { Button, Dropdown } from 'semantic-ui-react';

import { auth, firestore } from '../firebase';

import OptionsContext from '../context/OptionsContext';


function NavBar({history, location}) {

    const { isClosed, setClosed } = useContext(OptionsContext);

    const [loading , setLoading] = useState(false);
    const [closed, setIsClosed] = useState(null);

    useEffect(() =>
    {   
        setIsClosed(isClosed);
    }, [isClosed]);

    function toggleShop()
    {
        setLoading(true);
        firestore.collection("admin").doc("options")
            .update({isClosed: !isClosed})
            .then(() => 
            {
                setLoading(false);
                setClosed(!isClosed);
                history.push("/");
            })
            .catch(error => {
                setLoading(false);
                console.log(error);
            })
    }

    return (
        <div className="nav-container">
            <div className="navmenu">
                <Button style={{marginRight: '10px'}} color="olive" onClick={() => history.push(location.pathname.includes("/admin") ? "/" : "/admin")}>Go to {location.pathname.includes("/admin") ? "Site" : "Admin"}</Button>
                <Button style={{marginRight: '10px'}} loading={loading || closed === null} disabled={loading} primary onClick={() => toggleShop()}>{closed === true ? "Open Shop" : "Close Shop"}</Button>
                <Button negative onClick={() => auth.signOut().then(() => console.log("signed out"))}>Logout</Button>
            </div>
            <div className="navmenu-sm">
                <Dropdown button text="Menu" floating direction="left" >
                    <Dropdown.Menu style={{borderTopColor: '#b5cc18', borderTopWidth: '2px'}}>
                        <Dropdown.Item onClick={() => history.push(location.pathname.includes("/admin") ? "/" : "/admin")}><span style={{fontWeight: 'bolder', color: '#a3b814'}}>Go to {location.pathname.includes("/admin") ? "Site" : "Admin"}</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => toggleShop()}><span style={{fontWeight: 'bolder', color: '#2185d0'}}>{closed === true ? "Open Shop" : "Close Shop"}</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => auth.signOut().then(() => console.log("signed out"))}><span style={{fontWeight: 'bolder', color: '#8b0000'}}>Logout</span></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default withRouter(NavBar);

