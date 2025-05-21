'use client';

import FormInput from '../../forms/FormInput';
import Button from '../../buttons/Button';
import ForgotPassword from './ForgotPassword';
import { handleLogin } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';
import useLoginForm from '@/app/hooks/useLoginForm';

interface LoginFormProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const LoginForm = ({ onClose, onLoginSuccess }: LoginFormProps) => {
  const { 
    formData, 
    errors, 
    handleChange, 
    validateForm, 
    setErrors,
    resetForm
  } = useLoginForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // backend
        const response = await apiService.post('/api/auth/login/', formData);
        
        // success
        if (response.access && response.refresh && response.user?.pk) {
          await handleLogin(response.user.pk, response.access, response.refresh);
          resetForm();
          // close the modal
          onClose();
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else {
          handleApiErrors(response);
        }
      } catch (error) {
        // Handle network errors
        setErrors({
          email: 'Network error. Please try again later.',
          password: ''
        });
      }
    }
  };

  const handleApiErrors = (response: any) => {
    const newErrors = { email: '', password: '' };
    
    // If there's a non_field_errors message, show it in the email field
    if (response.non_field_errors) {
      newErrors.email = Array.isArray(response.non_field_errors) 
        ? response.non_field_errors[0] 
        : response.non_field_errors;
    }
    
    // Handle field-specific errors
    if (response.email) {
      newErrors.email = Array.isArray(response.email) ? response.email[0] : response.email;
    }
    
    if (response.password) {
      newErrors.password = Array.isArray(response.password) ? response.password[0] : response.password;
    }
    
    // If no specific errors were found but login failed, show generic error
    if (!newErrors.email && !newErrors.password) {
      newErrors.email = 'Login failed. Please check your credentials.';
    }
    setErrors(newErrors);
  };

  return (
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
      
      <ForgotPassword />
      
      <Button type="submit" fullWidth>
        Log In
      </Button>
    </form>
  );
};

export default LoginForm;