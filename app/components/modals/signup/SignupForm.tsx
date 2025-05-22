'use client';

// SignupForm.tsx
import { useRouter } from "next/navigation";
import FormInput from "../../forms/FormInput";
import Button from "../../buttons/Button";
import { handleLogin as handleLoginCookies } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';
import useSignupForm from '@/app/hooks/useSignupForm';

interface SignupFormProps {
  onClose: () => void;
  onSignupSuccess?: () => void;
}

const SignupForm = ({ onClose, onSignupSuccess }: SignupFormProps) => {
  // const router = useRouter();
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
        if (response.access_token && response.refresh_token && response.user?.pk) {
          await handleLoginCookies(response.user.pk.toString(), response.access_token, response.refresh_token);
          resetForm();
          if (onSignupSuccess) {
            onSignupSuccess();
          } else {
            onClose();
          }
        } else if(response.key) {
          // handle login
          console.warn("Registration successful, but no JWT tokens returned directly. User may need to log in.");
          resetForm();
          if (onSignupSuccess) {
            onSignupSuccess();
          } else {
            // close the modal
            onClose();
          }
        } else {
          handleApiErrors(response);
        } 
      } catch (error: any) {
        // Handle network errors
        if (error && error.data) {
            handleApiErrors(error.data);
        } else {
          setErrors({
            email: 'Network error. Please try again later.',
            password: '',
            confirmPassword: ''
          });
        }
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
    
    // dj-rest-auth often returns errors keyed by field name or as a list for non_field_errors/detail
    if (response.email) newErrors.email = Array.isArray(response.email) ? response.email[0] : response.email;
    if (response.username) newErrors.email = Array.isArray(response.username) ? response.username[0] : response.username; // If username error maps to email field
    if (response.password) newErrors.password = Array.isArray(response.password) ? response.password[0] : response.password;
    if (response.password2) newErrors.confirmPassword = Array.isArray(response.password2) ? response.password2[0] : response.password2;
    
    if (response.non_field_errors) {
        const NFE = Array.isArray(response.non_field_errors) ? response.non_field_errors[0] : response.non_field_errors;
        if (!newErrors.email) newErrors.email = NFE; // Show general errors in one field
    }
    if (response.detail) {
        const detailError = Array.isArray(response.detail) ? response.detail[0] : response.detail;
         if (!newErrors.email) newErrors.email = detailError;
    }

    if (!newErrors.email && !newErrors.password && !newErrors.confirmPassword && Object.keys(response).length > 0) {
        // Fallback for unhandled error structures
        newErrors.email = "Signup failed. Please check the form and try again.";
    }
    
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