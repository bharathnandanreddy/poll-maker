// ViewPoll.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { IDKitWidget, useIDKit } from '@worldcoin/idkit'
import { useParams } from 'react-router-dom';
const Poll = (props) => {
  const navigate = useNavigate();

  const { setOpen } = useIDKit()
  // Extract the contractAddress from the URL parameter
  const { contractAddress } = useParams();
  const [pollData, setPollData] = useState(null);
  const [selectedOption, setSelectedOption] = useState();
  const WID_APP_NAME = "app_staging_7d90950aae26c91805216210a49a5501"

  useEffect(() => {
    // Fetch poll data based on the contract address
    const fetchPollData = async () => {
      try {
        // Make a fetch request or use your preferred method to get poll details
        const response = await fetch(`http://localhost:4000/getPoll/${contractAddress}`); // Replace with your actual API endpoint
        const data = await response.json();

        // Update state with the fetched poll data
        setPollData(data);
      } catch (error) {
        console.error('Error fetching poll data:', error);
      }
    };

    fetchPollData();
  }, [contractAddress]);

  function voteSubmit() {
    if (props.account == "" || props.account == undefined) 
      alert("Connect to Metamask Account"); 
    else if (selectedOption == undefined) 
      alert("choose option");
    else setOpen(true);
  }


  function handleVerify(data) {
    const actionData = {
      nullifier_hash: data.nullifier_hash,
      merkle_root: data.merkle_root,
      proof: data.proof,
      verification_level: data.verification_level,
      action: "castVote_" + contractAddress,
      signal: "",
    };
    const userHash=data.nullifier_hash;
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
        handleVoteSubmission(userHash);
      })
      .catch(error => {
        console.error('API Error:', error);
      });

  }


  function onError(data) {
    console.error('error:', data);
    // Handle verified user data here
  }

  const handleVoteSubmission = async (userHash) => {
    try {
      const response = await fetch('http://localhost:4000/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractAddress: contractAddress,
          option: selectedOption,  // Make sure to update this based on your radio button logic
          hash: userHash, // Replace with your actual hash value
          account: props.account, // Replace with your actual account address
        }),
      });

      const result = await response.json();
      console.log(result); // Log the result or handle as needed
      navigate(`/pollResults/${contractAddress}`);
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  if (!pollData) {
    return <p>Loading poll data...</p>;
  }

  const { title, options } = pollData;


  return (
    <div>
      <header className='Poll'>
      <h2>View Poll</h2>
      <h3>{title}</h3>
      {/* Render poll options and handle voting logic */}
      {options.map((option, index) => (
        <div key={index}>
          <label>
            <input
              type="radio"
              name="voteOption"
              value={option}
              onChange={() => setSelectedOption(index)}
            // Add your voting logic here using userEvent or a custom function
            />
            {option}
          </label>
        </div>
      ))}
      <br></br>

      <button onClick={() => voteSubmit()}>Submit Vote</button>
      <IDKitWidget
        app_id={WID_APP_NAME}// obtained from the Developer Portal
        action={`castVote_${contractAddress}`} // this is your action name from the Developer Portal
        signal=""
        onSuccess={handleVerify}
        onError={onError}
        verification_level="orb" // minimum verification level accepted, defaults to "orb"
      >

      </IDKitWidget>
      </header>
    </div>

  );
};

export default Poll;
