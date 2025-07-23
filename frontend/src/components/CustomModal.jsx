import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

export default function CustomModal({ isOpen, onRequestClose, title, children }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000
        },
        content: {
          maxWidth: 500,
          margin: 'auto',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          border: 'none',
          background: '#fff',
          position: 'relative',
        }
      }}
    >
      <button onClick={onRequestClose} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>&times;</button>
      {title && <h2 style={{ marginTop: 0, marginBottom: 24 }}>{title}</h2>}
      {children}
    </Modal>
  );
}
