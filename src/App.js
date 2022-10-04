import kp from './keypair.json'
import React, { useEffect, useState } from 'react';
import TwitterHeart from 'twitter-heart';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {Program, Provider, web3} from '@project-serum/anchor';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
let baseAccount = web3.Keypair.fromSecretKey(secret);

// const baseAccount = web3.Keypair.fromSecretKey(secret)

const programID = new PublicKey('F8NjHsqvBW3jCisV265DY69v1EyDYN4dKUof4FJsHZyU');

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

// Constants
const TWITTER_HANDLE = 'yasseen_salama';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);
  const [isLiked] = useState('false');

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if(solana) {
        if(solana.isPhantom){
          const response = await solana.connect({ onlyIfTrusted: true });
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
  
  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log("No gif link given!")
      return
    }
    setInputValue('');
    console.log('Gif link:', inputValue);
    try {
      const provider = getProvider()
      const program = await getProgram(); 
  
      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully sent to program", inputValue)
  
      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error)
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider =  new Provider(connection, window.solana, opts.preflightCommitment,
      );
    return provider;
  }

  const shortenAddress = (address) => {
    return address.substring(0, 4) + '..' + address.substr(address.length - 4);
  } 


  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = await getProgram();
      
      console.log("ping")
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
      await getGifList();
  
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }
  

  const renderConnectButton = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}>
        Connect Wallet
    </button>
  );

  const heartClicked = (index) => {
    console.log(gifList[index].isLiked);
    if (gifList[index].isLiked) {
      gifList[index].likes -=1;
      gifList[index].isLiked = false;
    }
    else {
      gifList[index].likes +=1;
      gifList[index].isLiked = true;
      likeGif(gifList[index].gifLink);
    }
    let newGifList = JSON.parse(JSON.stringify(gifList));
    setGifList(newGifList);
  };

  const likeGif = async (gifLink) => {
    try {
      const provider = getProvider()
      const program = await getProgram(); 
  
      await program.rpc.likeGif(gifLink, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully liked", gifLink);
  
    } catch (error) {
      console.log("Error liking GIF:", error)
    }
  };
  

  const renderConnectedContainer = () => {
    // If true, program account hasn't been initialized.
      if (gifList === null) {
        console.log(gifList);
        return (
          <div className="connected-container">
            <button className="cta-button submit-gif-button" onClick={createGifAccount}>
              Do One-Time Initialization For GIF Program Account
            </button>
          </div>
        )
      }
    // Otherwise, account exists. User can submit GIFs.
  else {
    return(
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input
            type="text"
            placeholder="Enter GIF Link!"
            value={inputValue}
            onChange={onInputChange}
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
        <div className="gif-grid">
					{/* We use index as the key instead, also, the src is now item.gifLink */}
          {gifList.map((item, index) => (
            <div className="gif-item" key={index}>
              <img src={item.gifLink}/>
              <div className="gif-likes">
                <div className="like-heart"><TwitterHeart isLiked={item.isLiked} onHeartClick={()=>heartClicked(index)}></TwitterHeart></div>
                <div className="like-count"> {item.likes}</div>
                <div className="gif-owner">
                  <ul>
                  <li> {shortenAddress(item.userAddress.toString())}</li>
                  </ul>
                </div>
              </div>
              
              
            </div>
          ))}
        </div>
      </div>
    )
  }
}
const renderConnectedButton = () => {
  // If true, program account hasn't been initialized.
      return (
          <button className="cta-button wallet-address-button">
            <span className="icon">
              <img src="https://3632261023-files.gitbook.io/~/files/v0/b/gitbook-legacy-files/o/spaces%2F-MVOiF6Zqit57q_hxJYp%2Favatar-1615495356537.png?generation=1615495356841399&alt=media" alt="Phantom_logo" width="20" height="20"></img>
            </span>
            {shortenAddress(walletAddress)}
          </button>
      )
    }
  

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };  
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  const getProgram = async () => {
    // Get metadata about your solana program
    const idl = await Program.fetchIdl(programID, getProvider());
    // Create a program that you can call
    return new Program(idl, programID, getProvider());
  };
  
  const getGifList = async() => {
    try {
      const program = await getProgram(); 
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      
      console.log("Got the account", account)
      //TODO: change logic, this function gets called when a new GIF is added and threfore will set likes to 0  
      account.gifList.forEach(function (gif) {
        gif.isLiked = false; 
      });
      setGifList(account.gifList)
    } catch (error) {
      console.log("Error in getGifList: ", error)
      setGifList(null);
    }
  }
  
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      getGifList()
    }
  }, [walletAddress]);

  return (
  <div className="App">
  
  <div className={walletAddress ? 'authed-container' : 'container'}>
    <div className='nav-bar'>
        <div className="title">🖼️ GIF Portal on the Solana Blockchain</div>
        {walletAddress && renderConnectedButton()} 
    </div>
      

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
      >{`built by @${TWITTER_HANDLE}`}</a>
    </div>
  </div>
);
};

export default App;
