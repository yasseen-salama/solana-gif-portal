import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'yasseen_salama';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if(solana) {
        if(solana.isPhantom){
          console.log('Phantom wallet found.');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Please get a Phantom wallet!');
      }
    } catch(error){
      console.log(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };


  const renderConnectButton = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}>
        Connect Wallet
    </button>
  );
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };  
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
  <div className="App">
  <div className={walletAddress ? 'authed-container' : 'container'}>
    <div className="header-container">
      <p className="header">🖼 GIF Portal</p>
      <p className="sub-text">
        View your GIF collection in the metaverse ✨
      </p>
      {/* show the connect button only if we don't have a wallet address */}
      {!walletAddress && renderConnectButton()}
    </div>
    <div className="footer-container">
      <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
      <a
        className="footer-text"
        href={TWITTER_LINK}
        target="_blank"
        rel="noreferrer"
      >{`built on @${TWITTER_HANDLE}`}</a>
    </div>
  </div>
</div>
);
};

export default App;
