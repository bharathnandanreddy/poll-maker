
import './CreatePoll.css';

import { IDKitWidget, useIDKit } from '@worldcoin/idkit'

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePoll(props) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const { setOpen } = useIDKit()
  const WID_APP_NAME = "app_staging_7d90950aae26c91805216210a49a5501"

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleOptionChange = (event, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = event.target.value;
    setOptions(updatedOptions);
  };


  const handleAddOption = () => {
    const newOption = '';
    setOptions([...options, newOption]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (props.account == "" || props.account == undefined) 
    alert("Connect to Metamask Account"); 
    else
    setOpen(true)

  };

  function onError(data) {
    console.error('error:', data);
    // Handle verified user data here
  }

  function handleVerify(data) {
    const actionData = {
      nullifier_hash: data.nullifier_hash,
      merkle_root: data.merkle_root,
      proof: data.proof,
      verification_level: data.verification_level,
      action: "createPoll",
      signal: "",
    };
    console.log('Verification handler:', JSON.stringify(actionData));
    fetch('http://localhost:4000/api/v1/verify/' + WID_APP_NAME, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actionData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then(data => {
        console.log('API Response:', data);
          createSmartContract();
      })
      .catch(error => {
        console.error('API Error:', error);
      });

  }
  function createSmartContract(){
    var pollData={
      title:title,
      options:options,
      account:props.account
    }
    console.log(pollData);
    fetch('http://localhost:4000/createContract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pollData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.json();
      })
      .then(data => {
        console.log('Create Smart contract Response:', data);
        const contractAddress = data.contractAddress;

        // Navigate to the new route with the contractAddress
        navigate(`/poll/${contractAddress}`);
      })
      .catch(error => {
        console.error('Create Smart contract Error:', error);
      });

  }

  return (
    <div className="Poll">
      <header className="Poll-header">
        <div>
          <h2>Create a Poll</h2>
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter your title..."
              required
            />
          </div>
          <div className="form-group">
            {options.map((option, index) => (
              <div key={index} className="option">
                <label htmlFor={`option${index}`}>Option {index + 1}: </label>
                <input
                  type="text"
                  value={option}
                  onChange={(event) => handleOptionChange(event, index)}
                  required 
                />
              </div>
            ))}
            <button type="button" onClick={handleAddOption}>
              Add Option
            </button>
          </div>
          <button type="submit">Verify and Submit</button><br></br>
          </form>
          <IDKitWidget
            app_id={WID_APP_NAME}// obtained from the Developer Portal
            action="createPoll" // this is your action name from the Developer Portal
            signal=""
            onSuccess={handleVerify}
            onError={onError}
            verification_level="orb" // minimum verification level accepted, defaults to "orb"
          >

          </IDKitWidget>
        </div>
      </header>
    </div>
  );

}





export default CreatePoll;
