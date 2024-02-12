import React,{ useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';

const Pollresults = (props) => {
  const { contractAddress } = useParams();
  const [pollDetails, setPollDetails] = useState(null);

  useEffect(() => {
    const fetchPollDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/getDetails/${contractAddress}`);
        if (response.ok) {
          const data = await response.json();
          setPollDetails(data);
        } else {
          console.error('Error fetching poll details');
        }
      } catch (error) {
        console.error('Error fetching poll details:', error.message);
      }
    };

    fetchPollDetails();
  }, [contractAddress]);

  return (
    <div>
      <h2>Poll Results</h2>
      {pollDetails ? (
        <div>
          <p>Title: {pollDetails.title}</p>
            Results:
            <ul>
              {pollDetails.options.map((option, index) => (
                <li key={index}>
                  {option} - {pollDetails.votes[index]} votes
                </li>
              ))}
            </ul>
        </div>
      ) : (
        <p>Loading poll details...</p>
      )}
    </div>
  );
};

export default Pollresults;
