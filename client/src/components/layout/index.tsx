import React from 'react';
import './index.css';
import { Outlet, useLocation } from 'react-router-dom';
import SideBarNav from '../main/sideBarNav';
import Header from '../header';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 */
const Layout = () => {
  const location = useLocation();

  const isCurrentUserPage = location.pathname === '/currentUser';
  const isUserProfilePage = location.pathname.includes('/user');

  if (isCurrentUserPage || isUserProfilePage) {
    return (
      <>
        <Header />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <Header />
      <div id='main' className='main'>
        <SideBarNav />
        <div id='right_main' className='right_main'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
