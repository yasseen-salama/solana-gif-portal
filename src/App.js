import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'yasseen_salama';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://media2.giphy.com/media/RtnhB6YCTx6nC4Z1HL/giphy.gif?cid=ecf05e47zjw63q6e82l1fsr91sb1q27ojlso6put350kclkx&rid=giphy.gif&ct=g',
  'https://media4.giphy.com/media/3O57Bmb1yyHD8cffCc/giphy.gif?cid=790b76110ea54351858a5a9dc8df0f5f53974882263e8219&rid=giphy.gif&ct=g',
  'https://media0.giphy.com/media/3seRParXqUz4kibdNI/giphy.gif?cid=ecf05e473353za4nhfce7ab64z591ip4pwd6zg8l71xob7q7&rid=giphy.gif&ct=g',
  'https://media4.giphy.com/media/hdxVxqnXpaSdBkTG1J/giphy.gif?cid=ecf05e471y1kgiy2368z8hag6km2b36uajuaj5ckwd6t1rkc&rid=giphy.gif&ct=g',
  'https://media2.giphy.com/media/kDxwr1VbXRJd0JwWlF/giphy.gif?cid=ecf05e47u3m8cv6aucuyi9hjfli9jen1rpumdqmepaeda2cg&rid=giphy.gif&ct=g',
  'https://media2.giphy.com/media/RtnhB6YCTx6nC4Z1HL/giphy.gif?cid=ecf05e47aotuprvx4hx6a69xc8l5cgrqve92c9cgii9nnbnk&rid=giphy.gif&ct=g'
];

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

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <div className="gif-grid">
        {TEST_GIFS.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
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
      <p className="header">🚗  Dashboard GIF Portal</p>
      <p className="sub-text">
        View your GIF collection in the metaverse ✨
      </p>
      
      {/* show the connect button only if we don't have a wallet address */}
      {!walletAddress && renderConnectButton()}

      {/* show the GIFS if we have a wallet address */}
      {walletAddress && renderConnectedContainer()}
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
