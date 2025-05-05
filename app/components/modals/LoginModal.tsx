'use client';

import { useState } from 'react';
import FormInput from '../forms/FormInput';
import Button from '../buttons/Button';
import Modal from './Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }: LoginModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Here you would typically send the data to your backend
      console.log('Login form submitted:', formData);
      // For now, let's just close the modal
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log In">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        
        <FormInput
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />
        
        <div className="mt-2 mb-4">
          <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
            Forgot password?
          </a>
        </div>
        
        <Button type="submit" fullWidth>
          Log In
        </Button>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;