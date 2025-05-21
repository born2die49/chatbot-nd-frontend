'use client';

// SignupForm.tsx
import { useRouter } from "next/navigation";
import FormInput from "../../forms/FormInput";
import Button from "../../buttons/Button";
import { handleLogin } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';
import useSignupForm from '@/app/hooks/useSignupForm';

interface SignupFormProps {
  onClose: () => void;
  onSignupSuccess?: () => void;
}

const SignupForm = ({ onClose, onSignupSuccess }: SignupFormProps) => {
  const router = useRouter();
  const { 
    formData,
    errors,
    handleChange,
    validateForm,
    setErrors,
    resetForm,
  } = useSignupForm();

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
        const response = await apiService.post('/api/auth/register/', registrationData);
        
        // success
        if(response.access) {
          // handle login
          await handleLogin(response.user.pk, response.access, response.refresh);
          resetForm();
          // close the modal
          onClose();
          if (onSignupSuccess) {
            onSignupSuccess();
          }
        } else {
          handleApiErrors(response);
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

  const handleApiErrors = (response: any) => {
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
  };

  return (
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
    </form>
  );
};

export default SignupForm;