import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa6";

export default function DeleteBook() {
  let { id } = useParams();
  let [axiosMessage, setMessage] = useState('');
  let [deleted, setDeleted] = useState(false);
  let [book, setBook] = useState(null);
  let [loading, setLoading] = useState(true);
  let Navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get(`http://localhost:8000/bella-books/single-book-detail/${id}`)
      .then((res) => {
        setBook(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  function onClickYesDelete(e) {
    axios.delete(`http://localhost:8000/bella-books/delete-book/${id}`)
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
    Navigate('/bella-books/collection');
  }

  return (
    <div id="popup_main_div">
      {loading ? (
        <h1 id="popup_main_hone">Loading...</h1>
      ) : (
        <>
          {deleted ? (
            <h1 id="popup_main_hone">{axiosMessage}</h1>
          ) : (
            <h1 id="popup_main_hone">Delete this book?</h1>
          )}
          <p id="book-to_delete_title_author">
            <FaArrowRight /> {book ? book.title : "No name"} by {book ? book.author : "No name"}
          </p>
          {deleted ? (
            <div id="popup_btns_div_go_back">
              <button id="popup_delete_btn" onClick={cancelDeletionOrGoBack}>Go Back</button>
            </div>
          ) : (
            <div id="popup_btns_div">
              <button id="popup_cancel_btn" onClick={cancelDeletionOrGoBack}>Cancel</button>
              <button id="popup_delete_btn" onClick={onClickYesDelete}>Yes</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
