import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import Welcome from './Welcome';
import Login from './Login';
import { FaUserCircle } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { GrUserNew } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



export default function Register() {

    const Navigate = useNavigate();

    function GoToLogINPage (){
         Navigate('/user/login')
    }

   let [NewuserData , setNewUserData] = useState({
    username: "" , email: "" , password: ""
   })

   let [axiosMessage , setMessage] = useState('')

   function collectLoginData (e){
    e.preventDefault();
    setNewUserData((preData)=>({
        ...preData , [e.target.name] : e.target.value
    }));
    setMessage('')
   }

   async function submitRegisterationData(e){
    axios.defaults.withCredentials=true;
    await axios.post('http://localhost:8000/user/register' , NewuserData)
    .then((res)=>{
        setNewUserData({username: "" , email: "" , password: ""});
        Navigate('/user/login')
        setMessage(res.data.message)
    })
    .catch((err)=>{
        console.error(err);
        setMessage(err.response.data.message)
    })
   }
    return (
        <div id="login_main_div">
            <div id="login_Regsiter_sec_div" >
                <FaUserCircle id="profile"/>
                <h1>Welcome to Bella-Books Sign-up page</h1>
                <p id="error_Message">{axiosMessage}</p>
                <div id="log_in_form_div">
                    <div><label className="login_regis_labels" htmlFor="">Username:</label><input onChange={collectLoginData} className="login_regis_input" name='username' value={NewuserData.username}    type="text" /></div>
                    <div><label className="login_regis_labels" htmlFor="">Email:</label><input     onChange={collectLoginData} className="login_regis_input" name='email' value={NewuserData.email}    type="text" /></div>
                    <div><label className="login_regis_labels" htmlFor="">Password:</label><input onChange={collectLoginData} className="login_regis_input" name='password' value={NewuserData.passowrd} type="password" /></div>
                    <button onClick={submitRegisterationData}>Register <RiLoginCircleFill /></button>
                </div>
                
                    <p>Already have an account?</p>
                    <button id="no_account_sign_up_btn" onClick={GoToLogINPage}>Login<GrUserNew /></button>

                    </div>
        </div>
    )
}
