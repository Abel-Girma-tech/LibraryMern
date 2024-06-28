import React from 'react'
import { Link } from 'react-router-dom'
import Welcome from './Welcome';
import Login from './Login';
import { FaUserCircle } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import { GrUserNew } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';





export default function GetStarted() {
    const Navigate = useNavigate();

    function GoToLogINPage (){
         Navigate('/user/login')
    }
    function GoToRegisterPage (){
        Navigate('/user/register')
   }
    return (

        
        <div id="get_started_main_div">
                <FaUserCircle id="profile"/>
                <h1>Welcome to Bella-Books</h1>
                <div id="get_started_btns_div">
                    <button className="get_started_btns" onClick={GoToLogINPage}>Login <RiLoginCircleFill /></button>
                    <button className="get_started_btns" onClick={GoToRegisterPage}>Sign-up<GrUserNew /></button>
                </div>
        </div>
    )
}
