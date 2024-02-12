// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreatePoll from './CreatePoll';
import Poll from './Poll';
import { useSDK } from '@metamask/sdk-react';
import Pollresults from './Pollresults';

const App = () => {
    const [account, setAccount] = useState('');
    const { sdk, connected } = useSDK();

    const connect = async () => {
        try {
            const accounts = await sdk?.connect();
            console.log("accounts", accounts)
            setAccount(accounts?.[0]);
        } catch (err) {
            console.warn(`failed to connect..`, err);
        }
    };
    return (
        <Router>
            <div className="Poll">
                <header className='App-header'>
                    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>                        <ul>
                        <li>
                            <Link to="/create-poll">Create Poll</Link>
                        </li>
                    </ul>
                        <div>
                            {!(connected && account) && (
                                <button style={{ padding: 10, margin: 10 }} onClick={connect}>
                                    Connect
                                </button>
                            )}

                            {connected && (
                                <div>
                                    <>
                                        {account && `Connected account: ${account}`}
                                    </>
                                </div>
                            )}
                        </div>
                    </nav>

                </header>


                <Routes>
                    <Route path="/create-poll" element={<CreatePoll account={account} />} />
                    <Route path="/poll/:contractAddress" element={<Poll account={account} />} />
                    <Route path="/pollResults/:contractAddress" element={<Pollresults account={account} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
