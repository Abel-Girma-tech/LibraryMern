import React from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";


export default function ReadBook() {
    let [book, setBook] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get(`http://localhost:8000/bella-books/single-book-detail/${id}`)
      .then((res) => {
        setBook(res.data);
      })
      .catch((err) => {
        console.log(err)
      });
  }, [id]);

 console.log(book)

  return (
    <div id="book_detail_main_div">
      <button id="back_btn" onClick={() => navigate('/bella-books/collection')}>
        <IoMdArrowRoundBack /> Go Back
      </button>
      <div id="book_title_imag_div">
        <h1 className="book_title_author">{book.title}</h1>
        <p className="book_title_author">By: {book.author}</p>
        <p className="book_title_author">Published: { new Date (book.year).getFullYear()}</p>
        <img id="cover_image" src={book.cover} alt={`${book.title} cover`} />
      </div>
      <div id="book_desc_div">
        <p>
            <h1 className="book_title_author">{book.title}</h1>
          <b>Description: </b> {book.desc}
        </p>
      </div>
    </div>
  );
}
