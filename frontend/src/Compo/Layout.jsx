import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Lower from './Lower';
import { useLocation } from 'react-router-dom';


const Layout = () => {

    const location = useLocation();

    const hideHeaderAndFooter = location.pathname==='/user/register' || location.pathname==='/' || location.pathname==='/user/login'


    return (

        !hideHeaderAndFooter ? (<div className="layout">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <Lower/>
        </div>):(<div className="layout">
            <main className="main-content">
                <Outlet />
            </main>
        </div>)
        
    );
}

export default Layout;
