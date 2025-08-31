import React, { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation />
      <div className="flex-1 md:pl-0">
        <main className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;