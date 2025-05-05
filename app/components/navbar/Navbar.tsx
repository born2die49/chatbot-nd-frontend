'use client';

import { useState } from 'react';
import Logo from './Logo';
import ProfileDropdown from './ProfileDropdown';
import Image from 'next/image';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center z-10">
      <Logo />
      <div className="relative">
        <button 
          onClick={toggleDropdown}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {/* <img 
            src="../../public/user-avatar-male.png" 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://ui-avatars.com/api/?name=User&background=random";
            }}
          /> */}
          <Image
            src={"/user-avatar-male.png"}
            alt='user avatar profile pic'
            fill
            className="object-cover"
          />
        </button>
        {isDropdownOpen && <ProfileDropdown />}
      </div>
    </nav>
  );
};

export default Navbar;