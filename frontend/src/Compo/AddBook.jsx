import React from 'react'
import { useState } from 'react'
import axios from 'axios'



export default function AddBook() {

let [bookData , setBookData] = useState({title:'' , author:'' , year:'' , genre: '' , cover:'' , desc:''})
let [axiosMessage , setMessage] = useState({message : "" , success : null});


function collectNewBookData (e){
    e.preventDefault();
    setBookData((prevData)=>({
        ...prevData , [e.target.name] : e.target.value
    })) 
    
    setMessage({message : "" , success : null})
}

function donateBook(e){
    axios.defaults.withCredentials=true;
    e.preventDefault();

    axios.post('http://localhost:8000/bella-books/add-new-book' , bookData)
    .then((res)=>{
        setMessage({ message: res.data.message, success: true });

        setBookData({title:'' , author:'' , year:'' , genre: '' , cover:'' , desc:''})
    })
    .catch((err)=>{
        console.error(err);
        setMessage({ message: err.response.data.message, success: false });
        // setMessage(err.response.data.message)
    })
}

console.log(bookData)

    return (
        <div id="add_new_book_main_div">
           <h1>Add new Book</h1>
           <h3 style={{color:axiosMessage.success? "greenyellow" :"red"}}>{axiosMessage.message}</h3>
           <div className='add_edit_book_each_div'>
            <label htmlFor="" className='add_edit_book_labels'>Title:</label> <input onChange={collectNewBookData} name='title' value={bookData.title} className='add_edit_book_input' type="text" />
           </div>
           <div className='add_edit_book_each_div'>
            <label htmlFor="" className='add_edit_book_labels'>Author :</label> <input onChange={collectNewBookData} name='author' value={bookData.author} className='add_edit_book_input' type="text" />
           </div>
           <div className='add_edit_book_each_div'>
            <label htmlFor="" className='add_edit_book_labels'>Published Year   :</label> <input onChange={collectNewBookData} name='year' value={bookData.year} className='add_edit_book_input' type="date" />
           </div>
           <div className='add_edit_book_each_div'>
            <label htmlFor="" className='add_edit_book_labels'>Cover-Image  :</label> <input onChange={collectNewBookData} name='cover' value={bookData.cover} className='add_edit_book_input' type="text" />
           </div>
           <div className='add_edit_book_each_div'>
           <label htmlFor="" className='add_edit_book_labels'>Genre  :</label>
                <select onChange={collectNewBookData} name='genre' value={bookData.genre} className='add_edit_book_input'>
                    <option value=""></option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Young Adult">Young Adult</option>
                    <option value="Poetry">Poetry</option>
                    <option value="Drama">Drama</option>
                    <option value="Educational">Educational</option>
                    <option value="Religious & Spiritual">Religious & Spiritual</option>
                </select>
           </div>
           <div className='add_edit_book_each_div'>
            <label htmlFor="" className='add_edit_book_labels'>Decription   :</label> <textarea onChange={collectNewBookData} name='desc' value={bookData.desc} id="add_edit_book_text_area" placeholder="Write book decription..." className='add_edit_book_input' type="text" />
           </div>
           <button onClick={donateBook}>Donat Book</button>
        </div>
    )
}
