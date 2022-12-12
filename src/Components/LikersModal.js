import React from 'react';
import '../Components/LikersModal.css'

const shortenAddress = (address) => {
  return address.substring(0, 4) + '..' + address.substr(address.length - 4);
} 

const LikersModal = ({ modalState, onClose, likersAddress}) => {
  if (!modalState) {
    return null;
  }


  return (
    <div className="modal-container">
      <div className="content">
        <div className="col-md-12 d-flex flex-row justify-content-between">
          <h1 className="p-2">Likes</h1>
          <button onClick={onClose} type="button" className="btn-close p-2"></button>
          </div>
       
        
          { likersAddress.map((key, index) => 
          <div className="col-md-12 d-flex flex-row justify-content-between" key={index}>
            <div className="p-2"> {shortenAddress(key.toString())}</div>
            <div className="p-2">
            <a href= {"https://explorer.solana.com/address/" + key.toString() + "?cluster=devnet"} >
            <svg className="bi bi-box-arrow-up-right" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
  <path fillrule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
  <path fillrule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
</svg>
</a>
</div>
            </div>) }
        
      </div>
    </div>
  );
}

export default LikersModal;