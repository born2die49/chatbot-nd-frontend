interface SwitchToSignupProps {
  onSwitchToSignup: () => void;
}

const SwitchToSignup = ({ onSwitchToSignup }: SwitchToSignupProps) => {
  return (
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
  );
};

export default SwitchToSignup;