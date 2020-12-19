import React, { useState, useContext, useEffect } from 'react';

import { Container, Segment, Form, Button, Message, Loader } from 'semantic-ui-react';

import { firestore } from '../../firebase';
import OptionsContext from '../../context/OptionsContext';

import Title from '../../components/Title';
import './Order.css';


function Order({history}) {
  
  const { isClosed } = useContext(OptionsContext);

  const [closed, setClosed] = useState(null);

  useEffect(() => {
      setClosed(isClosed);
  }, [isClosed])

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [item, setItem] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [valid, setValid] = useState(true);
  const [itemList, setItemList] = useState([]);

  const [errors, setErrors] = useState([]);

  const addItemToList = () => 
  {
      let isValid = item.replace(/ +(?= )/g,'') !== "";
      setValid(isValid);

      if (isValid)
      {
          setItem("");
          setItemList([...itemList, item]);
      }
  }

  const removeItem = (key) =>
  {
      let newItemList = [...itemList];
      newItemList.splice(key, 1);
      setItemList(newItemList);
  }

  const validateNumber = () =>
  {
      const num = Number(number.replace( /^\D+/g, ''));
      
      if (num > 7000000 && num <= 9999999)
      {
          return true;
      }
      
      return false;
  }
  
  const onChange = (name, value) =>
  {
      switch(name)
      {
          case "item":
            setItem(value);
            break;
          case "name":
            setName(value);
            break;
          case "number":
            setNumber(value);
            break;
          default:
            console.log("input error");
      }
  }

  const handleSubmit = () =>
  {
      const isNameValid = name.replace(/ +(?= )/g,'') !== "";
      const isPhoneValid = validateNumber();

      let tempErrors = ["", ""];

      if (!isNameValid)
      {
          tempErrors[0] = "Please enter your name"
      }

      if (number.replace(/ +(?= )/g,'') === "")
      {
          tempErrors[1] = "Please enter your phone number"
      }
      else if(!isPhoneValid)
      {
          tempErrors[1] = "Please enter a valid mobile number"
      }

      setErrors(tempErrors);
    
      if (isNameValid && isPhoneValid)
      {
          setLoading(true);
          setSuccess(false);
          firestore.collection("orders").doc().set({
              name,
              number,
              items: itemList,
              status: "pending",
              orderedAt: new Date()
          })
          .then(() => {
              setItemList([]);
              setName("");
              setNumber("");
              setErrors([]);
              setLoading(false);

              setSuccess(true);
              setTimeout(() => {
                setSuccess(false);
              }, 5000)
          })
          .catch(() =>
          {
              console.log("Shop Closed");
              window.location.reload();
          })
      }
  }


  const renderClosed = () =>
  {
    return(
      <Container>
          <Title title="Faithful" sub="Online Orders" />
          <Message>
              <p style={{fontWeight: 'bold', wordSpacing: '.05em'}}>Sorry, our online portal is closed right now, contact <span style={{color: 'blue'}}>9996487</span> for further assistance</p>
          </Message>
      </Container>
    )
  }

  const renderContent = () => 
  {
    return(
      <Container>
                <Title title="Faithful" sub="Order Request" />
                {success ? <Message
                  success
                  header='Order Successfully Placed!'
                  onDismiss={() => setSuccess(false)}
                /> : null}
                <Segment.Group horizontal>
                    <Segment padded raised color="olive" size="big">
                        <Form>
                            <Form.Field>
                                <label style={{fontSize: '1.2em', marginBottom: '10px'}}>
                                    Name
                                </label>
                                {errors[0] ? <div style={{color: '#D8000C', marginBottom: '4px', marginTop: '8px'}}>{errors[0]}</div> : null}
                                <input type="text" value={name} onChange={(e) => onChange("name", e.target.value)} />
                            </Form.Field>
                            <Form.Field>
                                <label style={{fontSize: '1.2em', marginBottom: '10px'}}>
                                    Phone Number
                                </label>
                                {errors[1] ? <div style={{color: '#D8000C', marginBottom: '4px', marginTop: '8px'}}>{errors[1]}</div> : null}
                                <input type="text" maxLength={7} value={number} onChange={(e) => onChange("number", e.target.value)} />
                            </Form.Field>
                            <hr style={{marginTop: '25px', marginBottom: '25px', borderColor: 'rgba(0,0,0, 0.1)', borderRadius: '1px', borderWidth: '0.5px'}} />
                            

                            <div style={{display: 'flex', alignItems: 'flex-end'}}>
                              <div style={{width: '100%'}}>
                                  <Form.Field>
                                        <label style={{fontSize: '1.2em', marginBottom: '10px'}}>
                                          What would you like to order?
                                      </label>
                                      {!valid ? <div style={{color: '#D8000C', marginBottom: '4px', marginTop: '8px'}}>Please enter an item</div> : null}
                                      <input type="text" value={item} onChange={(e) => onChange("item", e.target.value)} />
                                  </Form.Field>
                              </div>
                              <div style={{marginLeft: '15px', marginBottom: '1px'}}>
                                  <Button onClick={() => addItemToList()} color="olive">Add</Button>
                              </div>
                            </div>
                        </Form>
                    </Segment>
                    <Segment id="list-segment" padded raised color="olive" size="big">
                        <h1 style={{marginBottom: '0px'}}>Items in list</h1>
                        {itemList.length === 0 ? 
                          <div>
                            <p style={{paddingTop: '20px'}}>List Empty. Add Items to List.</p>
                          </div> 
                        : 
                          <>
                            <small>Click on an item to delete</small>
                            <div style={{paddingTop: '20px'}}>
                              {itemList.map((item, key) => <li onClick={() => removeItem(key)} className="list-item" key={key}>{item}</li>)}
                            </div>
                            <div style={{position: 'absolute', bottom: 0, right: 0, paddingBottom: '20px', paddingRight: '20px'}}>
                                  <Button disabled={loading} loading={loading} onClick={() => handleSubmit()} color="olive" size="large">Request Order</Button>
                            </div>
                          </>
                        }
                    </Segment>
                </Segment.Group>

                  <Segment id="list-segment-sm" padded raised color="olive" size="big">
                        <h1 style={{marginBottom: '0px'}}>Items in list</h1>
                        {itemList.length === 0 ? 
                          <div>
                            <p style={{paddingTop: '20px'}}>List Empty. Add Items to List.</p>
                          </div> 
                        : 
                          <>
                            <small>Click on an item to delete</small>
                            <div style={{paddingTop: '20px'}}>
                              {itemList.map((item, key) => <li onClick={() => removeItem(key)} className="list-item" key={key}>{item}</li>)}
                            </div>
                            <div style={{position: 'absolute', bottom: 0, right: 0, paddingBottom: '20px', paddingRight: '20px'}}>
                                  <Button disabled={loading} loading={loading} onClick={() => handleSubmit()} color="olive" size="large">Request Order</Button>
                            </div>
                          </>
                        }
                    </Segment>
            </Container>
    )
  }
  
  return (
    <div className="app-container">
        <div className="form-container">
            {<Loader active={closed === null} size="massive" />}
            {closed === true && renderClosed()}
            {closed === false && renderContent()}
        </div>
    </div>
  );
}

export default Order;
