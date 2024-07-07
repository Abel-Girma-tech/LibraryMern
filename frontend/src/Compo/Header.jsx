import React, { useEffect, useState } from 'react';
import { GrSecure } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';
import axios from 'axios';

export default function Header() {
    const [userName, setUserName] = useState(null);
    const navigate = useNavigate();
    const [accHover, setHoverStatus] = useState(false);
    const [loading, setLoading] = useState(true);

    axios.defaults.withCredentials = true;

    function naviGateToPages(e) {
        const targetId = e.target.id;

        if (targetId === 'ul_li_to_colle') {
            navigate('/bella-books/collection');
        } else if (targetId === 'ul_li_to_donate') {
            navigate('/bella-books/add-new-book');
        } else if (targetId === 'ul_li_to_about') {
            navigate('/bella-books/about');
        } else if (targetId === 'ul_li_to_contact') {
            navigate('/bella-books/contact');
        } else if (targetId === 'ul_li_to_home') {
            navigate('/bella-books/home');
        }
    }

    function logOut() {
        axios.post('https://library-mern-ten.vercel.app/user/logout')
            .then(() => {
                navigate('/');
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function deleteAccount(e) {
        e.preventDefault();
        axios.delete('https://library-mern-ten.vercel.app/user/account/delete')
            .then((res) => {
                navigate('/');
                console.log(res.data.message);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        axios.get('https://library-mern-ten.vercel.app/user/info')
            .then((res) => {
                setUserName(res.data.userInfo.username);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    return (
        <div id="header_div">
            <h1 id="header_hone">Bella-Books</h1>
            <ul id="header_ul">
                <li id="ul_li_to_home" onClick={naviGateToPages} className='header_li'>Home</li>
                <li id="ul_li_to_colle" onClick={naviGateToPages} className='header_li'>Collections</li>
                <li id="ul_li_to_donate" onClick={naviGateToPages} className='header_li'>Donate-Book</li>
                <li id="ul_li_to_about" onClick={naviGateToPages} className='header_li'>About</li>
            </ul>
            <div
                onMouseEnter={() => setHoverStatus(true)}
                onMouseLeave={() => setHoverStatus(false)}
                id="header_user_section"
            >
                <p id="user_name">
                    <CgProfile id="profile_icon" /> Hi {loading ? "Loading..." : userName}! <GrSecure id='log_out_btn' />
                </p>

                {accHover ? (
                    <ul id="user_acc_sec">
                        <li className='account_action_list'>Account Info</li>
                        <li onClick={deleteAccount} className='account_action_list'>Delete Account</li>
                        <li onClick={logOut} className='account_action_list'>Log Out</li>
                    </ul>
                ) : null}
            </div>
        </div>
    );
}
