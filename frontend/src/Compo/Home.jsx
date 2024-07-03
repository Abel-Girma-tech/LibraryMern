import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers } from "react-icons/fa";
import { SiBookstack } from "react-icons/si";
import { useNavigate } from 'react-router-dom';


const Home = () => {

  const Navigate = useNavigate();
  const [numberOfBooks , setBookNumber]=useState(0);
  const [numberOfUsers , setNumberOfUsers] = useState(0);
  const [latestBooks , setLatestBooks] = useState(null);


  
  useEffect(() => {
    axios.get('https://library-mern-ten.vercel.app/bella-books/collection')
        .then((res) => { setBookNumber(res.data.length);
         })
        .catch((err) => {
            console.error(err)
        });
}, [1]);

useEffect(() => {
  axios.get('https://library-mern-ten.vercel.app/bellabooks/latest-users')
      .then((res) => { 
                            setLatestBooks(res.data)
       })
      .catch((err) => {
          console.error(err)
      });
}, []);

useEffect(() => {
  axios.get('https://library-mern-ten.vercel.app/bellabooks/users')
      .then((res) => { setNumberOfUsers(res.data.length) })
      .catch((err) => {
          console.error(err)
      });
}, [1]);



console.log(numberOfBooks);



  return(
        <div id="home_main_div">
          <h1 className='home_items'>Welcome to Bella-Book Store</h1>
          <h2 className='home_items'>What we have here!</h2>
          <p className='home_items'>
          Welcome to Bella-Books, the largest online bookstore in the United States! At Bella-Books, we believe in the power of stories and the magic of books. Our mission is to connect book lovers from all corners of the country by providing an extensive collection of books donated by our generous community. Whether you're looking for the latest bestseller, a timeless classic, or a unique find, Bella-Books has something for everyone. We pride ourselves on our commitment to promoting literacy and fostering a love for reading. By offering a platform where books can be shared and enjoyed by all, we aim to create a community that values knowledge, imagination, and the joy of reading. Join us in our journey to make the world a better place, one book at a time.
          </p>
        <div id='DashBoard_active_user_and_number_of_books'>
                <div className='dashboard_each_div'>
                    <h2><FaUsers /></h2>
                    <h2>Over {numberOfUsers}+ </h2>
                    <h2>Active users</h2>
                </div>
                <div className='dashboard_each_div'>
                    <h2><SiBookstack /></h2>
                    <h2>Over {numberOfBooks}+ </h2>
                    <h2>Book Collections</h2>
                </div>
        </div>

        <div id='home_items_card_div' className='home_items'>
                <h3 className='home_items'>Latest books to hit our library</h3>
                <div id="home_book_card_div">

                  {latestBooks.map((eachBook)=>{

                    return(

                      <div key={eachBook._id} className='each_book_card_div'>
                        <p>{eachBook.title}</p>
                        <img className="each_home_card_image"src={eachBook.cover} alt="" />
                      </div>


                    )


                  })}
                    

              </div>
              <div id="explore_more_b00ks_div">
                      <button onClick={()=>Navigate('/bella-books/collection')}id="explore_more_b00ks_btn">Explore more books from our collections</button>
              </div>
        </div>

        <div id="donate_books_home_div">
          <h3 className='home_items'>
            How we get our books?
          </h3>
          <div  className='home_items'id="how_we_get_book_pargraph_and_image_div">
            <p id="how_we_get_book_paragraph" className='home_items'>At Bella-Books, our expansive library is a testament to the generosity and passion of individuals across the United States who believe in the transformative power of literature. Every book in our collection is a cherished donation from a diverse array of contributors: avid readers, educators, authors, and passionate book lovers. These donations encompass a wide spectrum of genres and topics, from beloved classics and contemporary bestsellers to specialized subjects and niche interests, ensuring that there is something for everyone to explore and enjoy.

Our donors come from all walks of life, each motivated by a deep-seated belief in the importance of sharing knowledge, stories, and the joy of reading with others. Whether it's a retired teacher donating their personal library, a bestselling author contributing copies of their latest work, or families passing down cherished books across generations, every donation enriches our library and broadens our community's literary horizons.</p>
            <img id="people_donating_image" src="https://bookscouter.com/blog/wp-content/uploads/2023/05/book_charity.jpg" alt="" />
          </div>
          <button onClick={()=>Navigate('/bella-books/add-new-book')}className='home_items' id='donat_button_home'>Want to Donat? Click Here!</button>
        </div>



        </div>

    );
};

export default Home;
