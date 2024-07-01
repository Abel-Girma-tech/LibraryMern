import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = () => {
    let access = Cookies.get('access_token');
    let refresh = Cookies.get('refresh_token');

    console.log('Access Token:', access); // Debugging statement
    console.log('Refresh Token:', refresh); // Debugging statement

    return refresh ? <Outlet /> : <Navigate to='/user/login'/>;
};

export default PrivateRoute;
