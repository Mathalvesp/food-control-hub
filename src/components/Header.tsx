
import React from 'react';

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 h-16">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">24por7 FOOD</h1>
        </div>
        {userName && (
          <div className="text-gray-700">
            <span className="text-sm">Bem-vindo, <strong>{userName}</strong></span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
