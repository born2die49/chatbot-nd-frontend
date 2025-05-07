'use client';

import { useState } from 'react';
import FormInput from '../forms/FormInput';
import Button from '../buttons/Button';
import Modal from './Modal';
import { useRouter } from "next/navigation";
import { handleLogin } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSignupSuccess?: () => void;
}

const SignupModal = ({ isOpen, onClose, onSwitchToLogin, onSignupSuccess }: SignupModalProps) => {
  // variables
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // frontend validation
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
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const registrationData = {
          username: formData.email,  // Django REST Auth expects username
          email: formData.email,
          password1: formData.password,
          password2: formData.confirmPassword
        };

        // backend
        const response = await apiService.post('/api/auth/register/', JSON.stringify(registrationData));

        console.log('Signup form submitted:', formData);

        // success
        if(response.access) {
          // handle login
          handleLogin(response.user.pk, response.access, response.refresh )

          // close the modal
          onClose();
          if (onSignupSuccess) {
            onSignupSuccess();
            setFormData({email: '', password: '', confirmPassword: ''});
          }
        } else {
          // error object
          const newErrors = { 
            email: '', 
            password: '', 
            confirmPassword: '' 
          };

          // map errors from response
          const errorMessages = Object.values(response).map((error: any) => error);

          if (errorMessages.length > 0) newErrors.email = errorMessages[0];
          if (errorMessages.length > 1) newErrors.password = errorMessages[1];
          if (errorMessages.length > 2) newErrors.confirmPassword = errorMessages[2];

          setErrors(newErrors);
        } 
      } catch (error) {
        // Handle network errors
        setErrors({
          email: 'Network error. Please try again later.',
          password: '',
          confirmPassword: ''
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          id="signup-email"
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
          id="signup-password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />
        
        <FormInput
          label="Confirm Password"
          id="signup-confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
        
        <Button type="submit" fullWidth>
          Sign Up
        </Button>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              Log In
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default SignupModal;