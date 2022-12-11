import React from 'react';
import '../Components/LikersModal.css'

const LikersModal = ({ modalState, onClose, likersAddress }) => {
  if (!modalState) {
    return null;
  }
  console.log(likersAddress);


  return (
    <div className="modal-container">
      <div className="content">
      <button onClick={onClose}>Close</button>
        <h2>Likers</h2>
        <ul>
          {likersAddress.map((key, index) => <li key={index}>{key.toString()}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default LikersModal;