import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

export default function Collection() {
    let Navigate = useNavigate();
    let [BooksData, setBooks] = useState([]);
    let [searchText, setSearhText] = useState('');
    let [selectGenre, setGenre] = useState('');

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('https://library-mern-ten.vercel.app/bella-books/collection')
            .then((res) => { setBooks(res.data) })
            .catch((err) => {
                console.error(err)
            });
    }, []);

    function navigateToAction(e, id) {
        if (e.target.id === "edit_btn") {
            Navigate(`/bella-books/edit-book/${id}`);
        }
        if (e.target.id === "view_btn" || e.target.id === "coll_card_div") {
            Navigate(`/bella-books/single-book-detail/${id}`);
        }
        if (e.target.id === "delete_btn") {
            Navigate(`/bella-books/delete-book/${id}`);
        }
    }

    function searchBook(e) {
        setSearhText(e.target.value);
    }

    function generSelector(e) {
        setGenre(e.target.value);
    }

    return (
        <div id="Coll_main_div">
            <div>
                <h1 id="coll_hOne">Welcome to our books collection.</h1>
            </div>
            <div id="searchBox_div">
                <label id="searchBox_label" htmlFor="">Search <FiSearch /></label>{' '}
                <input id="searchBox" onChange={searchBook} value={searchText} type="text" placeholder='Search your favourite book by title, author, etc...' />
            </div>
            <div id="searchBox_div_selector_div">
                <label id="selector_label">Sort by:</label>
                <select onChange={generSelector} id="selector_sort" name='genre' className='add_edit_book_input'>
                    <option value="">All</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Young Adult">Young Adult</option>
                    <option value="Poetry">Poetry</option>
                    <option value="Drama">Drama</option>
                    <option value="Educational">Educational</option>
                    <option value="Religious & Spiritual">Religious & Spiritual</option>
                </select>
            </div>
            <div id="collection_card_container_div">
                {BooksData
                    .filter((item) => {
                        return searchText.length === 0
                            ? true
                            : item.title.toLowerCase().includes(searchText.toLowerCase()) ||
                              item.author.toLowerCase().includes(searchText.toLowerCase());
                    })
                    .filter((item) => {
                        return selectGenre === ""
                            ? item
                            : item.genre === selectGenre;
                    })
                    .map((item, index) => {
                        return (
                            <ul onClick={(e) => navigateToAction(e, item._id)} id="coll_card_div" key={index}>
                                <li>{item.title}</li>
                                <li>
                                    <img width="150px" src={item.cover} alt="" />
                                </li>
                                <li>{item.author}</li>
                                <li>{new Date(item.year).getFullYear()}</li>
                                <div id="card_btns_div">
                                    <button onClick={(e) => navigateToAction(e, item._id)} id="edit_btn" className="card_btns">
                                        Edit
                                    </button>
                                    <button onClick={(e) => navigateToAction(e, item._id)} id="view_btn" className="card_btns">
                                        View
                                    </button>
                                    <button onClick={(e) => navigateToAction(e, item._id)} id="delete_btn" className="card_btns">
                                        Delete
                                    </button>
                                </div>
                            </ul>
                        );
                    })}
            </div>
        </div>
    );
}
