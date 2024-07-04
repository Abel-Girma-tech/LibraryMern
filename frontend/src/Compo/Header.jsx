import React, { useEffect } from 'react'
import { AiOutlineLogout } from "react-icons/ai";
import { GrSecure } from "react-icons/gr";
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';


export default function Header() {
   
    const Navigate = useNavigate()
    const [accHover , setHoverStatus] = useState(false);
    axios.defaults.withCredentials=true;

    function naviGateToPages(e){
        if(e.target.id==="ul_li_to_colle"){
            Navigate('/bella-books/collection')
        }

        if(e.target.id==="ul_li_to_donate"){
            Navigate('/bella-books/add-new-book')
        }
        if(e.target.id==="ul_li_to_about"){
            Navigate('/bella-books/about')
        }

        if(e.target.id==="ul_li_to_contact"){
            Navigate('/bella-books/contact')
        }

        if(e.target.id==="ul_li_to_home"){
            Navigate('/bella-books/home')
        }
    }
    
function logOut(){

    axios.post('https://library-mern-ten.vercel.app/user/logout')
    .then(()=>{
        Navigate('/')
    })

    .catch((err)=>{
        console.log(err)
    })
}
  






    return (
        <div id="header_div">
            <h1 id="header_hone">Bella-Books</h1>
            <ul id="header_ul">
                <li id="ul_li_to_home" onClick={naviGateToPages}className='header_li'>Home</li>
                <li id="ul_li_to_colle" onClick={naviGateToPages}className='header_li'>Collections</li>
                <li id="ul_li_to_donate" onClick={naviGateToPages}className='header_li'>Donate-Book</li>
                <li id="ul_li_to_about" onClick={naviGateToPages}className='header_li'>About</li>
            </ul>
            <div onMouseEnter={(e)=>setHoverStatus(true)} onMouseLeave={(e)=>setHoverStatus(false)} id="header_user_section">
                <p id="user_name">Hi Abel! <GrSecure id='log_out_btn' /></p>

                {accHover?( <ul id="user_acc_sec">
                    <li className='account_action_list'>Account Info</li>
                    <li className='account_action_list'>Delete Account</li>
                    <li onClick={logOut}className='account_action_list'>Log Out</li>
                </ul>):(<p></p>) }            
            </div>
        </div>
    )
}
