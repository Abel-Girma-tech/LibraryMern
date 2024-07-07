import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa6";

export default function DeleteAccount() {

  axios.defaults.withCredentials = true;

  const navigate = useNavigate()

  const [deleteMessage ,  setMessage] = useState('');
  const [deleteStatus , setDeleted] = useState(false);



  function onClickYesDeleteAccount(e) {
    e.preventDefault();
    axios.delete(`https://library-mern-ten.vercel.app/user/account/delete`)
      .then((res) => {
        setMessage(res.data.message);
        setDeleted(true);
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.response.data.message);
        setDeleted(true);
      });
  }

  function cancelDeletionOrGoBack(e) {
    navigate('/bella-books/collection');
  }

  return (
    <div id="popup_main_div">
      
        
          {deleteStatus ? (
            <h1 id="popup_main_hone">{deleteMessage}</h1>
          ) : (
            <h1 id="popup_main_hone">Delete this account?</h1>
          )}
          <p id="book-to_delete_title_author">
            We are sorry to see you go. We hope you will be back someday!
          </p>
          {deleteStatus ? (
            <div id="popup_btns_div_go_back">
              <button id="popup_delete_btn" onClick={cancelDeletionOrGoBack}>Go Back</button>
            </div>
          ) : (
            <div id="popup_btns_div">
              <button id="popup_cancel_btn" onClick={cancelDeletionOrGoBack}>Cancel</button>
              <button id="popup_delete_btn" onClick={onClickYesDeleteAccount}>Yes</button>
            </div>
          )}

    </div>
  );
}
