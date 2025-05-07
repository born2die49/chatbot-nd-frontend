'use client';

// LoginModal.tsx
import { useState } from 'react';
import Modal from '../Modal';
import LoginForm from './LoginForm';
import SwitchToSignup from './SwitchToSignup';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  onLoginSuccess?: () => void;
}

const LoginModal = ({ isOpen, onClose, onSwitchToSignup, onLoginSuccess }: LoginModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log In">
      <LoginForm 
        onClose={onClose} 
        onLoginSuccess={onLoginSuccess} 
      />
      <SwitchToSignup onSwitchToSignup={onSwitchToSignup} />
    </Modal>
  );
};

export default LoginModal;