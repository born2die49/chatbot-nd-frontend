'use client';

// hooks/useLoginForm.ts
import { useState } from 'react';

const useLoginForm = () => {
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
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: ''
    });
    setErrors({
      email: '',
      password: ''
    });
  };

  return {
    formData,
    errors,
    setFormData,
    setErrors,
    handleChange,
    validateForm,
    resetForm
  };
};

export default useLoginForm;