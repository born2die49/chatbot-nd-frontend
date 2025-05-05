'use client';

import Button from './Button';

interface AuthButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

const AuthButton = ({ label, onClick, variant = 'primary' }: AuthButtonProps) => {
  return (
    <Button 
      variant={variant}
      size="sm"
      onClick={onClick}
      className="ml-2"
    >
      {label}
    </Button>
  );
};

export default AuthButton;