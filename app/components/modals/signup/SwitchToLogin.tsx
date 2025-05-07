'use client';

// SwitchToLogin.tsx
interface SwitchToLoginProps {
  onSwitchToLogin: () => void;
}

const SwitchToLogin = ({ onSwitchToLogin }: SwitchToLoginProps) => {
  return (
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
  );
};

export default SwitchToLogin;