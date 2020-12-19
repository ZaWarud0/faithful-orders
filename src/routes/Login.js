import React, { useState, useContext } from 'react';

import { Redirect, withRouter } from "react-router";
import { Container, Segment, Form, Button, Message } from 'semantic-ui-react';

import { auth } from '../firebase';

import Title from '../components/Title';
import AuthContext from '../context/AuthContext';

const Login = ({ history, location }) =>
{
    const { currentUser } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passError, setPassError] = useState("");

    const onChange = (name, value) =>
    {
        switch(name)
        {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                console.log("input error");
        }
    }

    const handleSumit = () => 
    {
        if (email && password)
        {
            setLoading(true);
            auth.signInWithEmailAndPassword(email, password)
            .then(() => 
            {
                setLoading(false);
                history.push(location.state.from.pathname);
            })
            .catch(error => {
                setLoading(false);
                setError(error.message);
            })
        }
        else
        {
            setEmailError("Username is required");
            setPassError("Password is required");
        }
    }

    if (currentUser)
    {
        return <Redirect to={location.state.from.pathname}/>;
    }

    return (
        <div className="app-container">
            <div className="form-container">
                <Container>
                    <div className="login-container">
                    <Title title="Faithful" sub="Login" />
                    <Segment padded="very" raised color="olive" size="big">
                            <Form>
                                {error ? <Message size="small" negative>{error}</Message> : null}
                                <Form.Field className="vPadding">
                                    <label style={{fontSize: '1.2em', marginBottom: '10px'}}>
                                        Username
                                    </label>
                                    {emailError ? <div style={{color: '#D8000C', marginBottom: '4px', marginTop: '8px'}}>{emailError}</div> : null}
                                    <input type="text" maxLength={100} value={email} onChange={(e) => onChange("email", e.target.value)} />
                                </Form.Field>
                                <Form.Field className="vPadding">
                                    <label style={{fontSize: '1.2em', marginBottom: '10px'}}>
                                        Password
                                    </label>
                                    {passError ? <div style={{color: '#D8000C', marginBottom: '4px', marginTop: '8px'}}>{passError}</div> : null}
                                    <input type="password" maxLength={100} value={password} onChange={(e) => onChange("password", e.target.value)} />
                                </Form.Field>
                                <Form.Field className="vPadding">
                                    <Button disabled={loading} loading={loading} onClick={() => handleSumit()} fluid style={{marginTop: '20px'}} color="olive" size="large">Login</Button>
                                </Form.Field>
                            </Form>
                    </Segment>
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default withRouter(Login);