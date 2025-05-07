'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';
import ProfileDropdown from './ProfileDropdown';
import AuthButton from '../buttons/AuthButton';
import LoginModal from '../modals/login/LoginModal';
import SignupModal from '../modals/SignupModal';
import Image from 'next/image';
import { getUserId, resetAuthCookies } from '@/app/lib/actions'; 
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const userId = await getUserId();
      setIsLoggedIn(!!userId);
    };
    
    checkAuthStatus();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const handleLogin = () => {
    // This would be replaced with your actual authentication logic
    setIsLoggedIn(true);
    closeLoginModal();
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    closeLoginModal();
    router.refresh(); // Refresh the page to update state across components
  };

  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
    closeSignupModal();
    router.refresh(); // Refresh the page to update state across components
  };

  const handleLogout = () => {
    resetAuthCookies();

    setIsLoggedIn(false);
    setIsDropdownOpen(false);

    router.refresh();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center z-10">
        <Logo />
        
        <div className="flex items-center">
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Image
                  src={"/user-avatar-male.png"}
                  alt='user avatar profile pic'
                  fill
                  className="object-cover rounded-4xl"
                />
              </button>
              {isDropdownOpen && <ProfileDropdown onLogout={handleLogout} />}
            </div>
          ) : (
            <div className="flex">
              <AuthButton 
                label="Log In" 
                onClick={openLoginModal} 
                variant="outline"
              />
              <AuthButton 
                label="Sign Up" 
                onClick={openSignupModal}
              />
            </div>
          )}
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
        onSwitchToSignup={openSignupModal}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={closeSignupModal} 
        onSwitchToLogin={openLoginModal}
        onSignupSuccess={handleSignupSuccess}
      />
    </>
  );
};

export default Navbar;