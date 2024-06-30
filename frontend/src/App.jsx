import './App.css';
import About from './Compo/About';
import Home from './Compo/Home';
import Welcome from './Compo/Welcome';
import DeleteBook from './Compo/DeleteBook';
import AddBook from './Compo/AddBook';
import EditBook from './Compo/EditBook';
import Login from './Compo/Login';
import Register from './Compo/Register';
import Collection from './Compo/Collection';
import { BrowserRouter , Route , Routes , Link } from 'react-router-dom';
import GetStarted from './Compo/GetStarted';
import ReadBook from './Compo/ReadBook';
import Layout from './Compo/Layout';
import PrivateRoute from './Compo/PrivateRoute'






function App() {
  return (

    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PrivateRoute/>}>
                <Route path='/bella-books/home' element={<Home/>}/>
                <Route path='/bella-books/collection' element={<Collection/>}/>
                <Route path='/bella-books/add-new-book' element={<AddBook/>}/>
                <Route path='/bella-books/single-book-detail/:id' element={<ReadBook/>}/>
                <Route path='/bella-books/edit-book/:id' element={<EditBook/>}/>
                <Route path='/bella-books/delete-book/:id' element={<DeleteBook/>}/>
                <Route path='/bella-books/about' element={<About/>}/>
          </Route>
          <Route path='/' element={<GetStarted/>}/>
          <Route path='/user/login' element={<Login/>}/>
          <Route path='/user/register' element={<Register/>}/>
          </Route>
        </Routes>
    </BrowserRouter>

  );
}

export default App;
