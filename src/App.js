import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { auth, firestore } from './firebase'; 
import AuthContext from './context/AuthContext';
import OptionsContext from './context/OptionsContext';
import PreLoader from './components/PreLoader';
import PrivateRoute from './components/PrivateRoute';

import Order from './routes/Order/Order';
import Admin from './routes/Admin';
import Login from './routes/Login';

import NavBar from './components/NavBar';

const App = () => {

    const [currentUser, setCurrentUser] = useState(null);
    const [isClosed, setIsClosed] = useState(null);
    const [loading, setLoading] = useState(false);


    useEffect(() =>
    {
      firestore.collection("admin").doc("options").get()
        .then(doc =>
          {
              if(doc.exists)
              {
                setIsClosed(doc.data().isClosed);
              }
          })
    })


    useEffect(() => 
    {
            setLoading(true);
            auth.onAuthStateChanged(user => 
            {
                if (user)
                {
                    setCurrentUser(user);
                }
                else
                {
                    setCurrentUser(null);
                }

                setLoading(false);
            })

    }, [])

    const setClosed = (closed) => 
    {
        setIsClosed(closed);
    }

    return (
        <div>
            {loading ? <PreLoader /> : null}
            <AuthContext.Provider value={{ currentUser }}>
                <OptionsContext.Provider value= {{ isClosed, setClosed: setClosed }}>
                    <Router>
                        {currentUser ? <NavBar /> : null}
                        <Switch>
                            <Route path="/" exact component={Order} />
                            <PrivateRoute path="/admin/" exact component={Admin} />
                            <Route path="/admin/login" exact component={Login} />
                        </Switch>
                    </Router>
                </OptionsContext.Provider>
            </AuthContext.Provider>
        </div>
    )
}

export default App;
