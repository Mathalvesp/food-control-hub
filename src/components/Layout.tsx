
import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import Header from './Header';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Layout = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (!storedUserName && location.pathname !== '/') {
      navigate('/');
    } else if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [navigate, location.pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header userName={userName} />
          <main className="flex-1 pt-16 p-6 bg-gray-50">
            <SidebarTrigger className="mb-4 md:hidden" />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
