import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { GrUserNew } from "react-icons/gr";
import axios from 'axios';

export default function Login() {
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        username: "",
        password: ""
    });

    const [axiosMessage, setMessage] = useState('');

    const collectLoginData = (e) => {
        setUserData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }));
        setMessage('');
    };

    const submitLogData = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://library-mern-ten.vercel.app/user/login', userData);
            setUserData({ username: "", password: "" });
            navigate('/bella-books/home');
            setMessage(res.data.message);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage('An error occurred. Please try again.');
            }
        }
    };

    const navToRegister = (e) => {
        e.preventDefault();
        navigate('/user/register');
    };

    return (
        <div id="login_main_div">
            <div id="login_sec_div">
                <FaUserCircle id="profile" />
                <h1>Welcome to Bella-Books Login page</h1>
                <p>Please put your login credentials</p>
                <p id="error_Message">{axiosMessage}</p>
                <div id="log_in_form_div">
                    <div>
                        <label className="login_regis_labels" htmlFor="username">Username:</label>
                        <input
                            onChange={collectLoginData}
                            className="login_regis_input"
                            name="username"
                            value={userData.username}
                            type="text"
                        />
                    </div>
                    <div>
                        <label className="login_regis_labels" htmlFor="password">Password:</label>
                        <input
                            onChange={collectLoginData}
                            className="login_regis_input"
                            name="password"
                            value={userData.password}
                            type="password"
                        />
                    </div>
                    <button onClick={submitLogData}>Login <RiLoginCircleFill /></button>
                </div>
                <p>New to Bella-Books?</p>
                <button id="no_account_sign_up_btn" onClick={navToRegister}>Sign-up<GrUserNew /></button>
            </div>
        </div>
    );
}
