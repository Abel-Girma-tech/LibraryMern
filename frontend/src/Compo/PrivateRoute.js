import {Outlet , Navigate} from 'react-router-dom'
import Cookies from 'js-cookie';

const PrivateRoute =()=>{


    let access = Cookies.get('access_token');
    let refresh = Cookies.get('refresh_token');


    return (

        refresh?
<Outlet/> : <Navigate to='user/login' replace />   )
}

export default PrivateRoute;