import React from 'react';
import '../Components/LikersModal.css'

const LikersModal = ({ modalState, onClose, strings }) => {
  if (!modalState) {
    return null;
  }

  return (
    <div className="modal-container">
      <div className="content">
      <button onClick={onClose}>Close</button>
        <h2>Likers</h2>
        <ul>
          {strings.map((string, index) => <li key={index}>{string}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default LikersModal;