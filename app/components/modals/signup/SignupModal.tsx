'use client';

// SignupModal.tsx
import { useState } from 'react';
import Modal from '../Modal';
import SignupForm from './SignupForm';
import SwitchToLogin from './SwitchToLogin';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSignupSuccess?: () => void;
}

const SignupModal = ({ isOpen, onClose, onSwitchToLogin, onSignupSuccess }: SignupModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
      <SignupForm 
        onClose={onClose} 
        onSignupSuccess={onSignupSuccess} 
      />
      <SwitchToLogin onSwitchToLogin={onSwitchToLogin} />
    </Modal>
  );
};

export default SignupModal;