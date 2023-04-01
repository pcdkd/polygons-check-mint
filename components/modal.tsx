import React from 'react';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-body">
      <button className="modal-close" onClick={onClose}>
          X
        </button>
        <div className="modal-content">
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default Modal;