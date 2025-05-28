
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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header userName={userName} />
          <main className="flex-1 p-6 overflow-auto">
            <SidebarTrigger className="mb-4 lg:hidden" />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
