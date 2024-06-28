require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const mongoURL = process.env.MONGO_URI;
const PORT = process.env.PORT;
const accessTokSecKey = process.env.accessTokSecKey;
const refreshTokSecKey = process.env.refreshTokSecKey;
const app = express();
const userModel = require('./models/newUserModel.js')
const booksModel = require('./models/bookCollectionModel.js')

console.log(booksModel)
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from localhost:3000
    credentials: true // Allow sending cookies from the client
  }));
app.use(express.json());
app.use(cookieParser());



mongoose.connect(mongoURL)
.then(()=>{

    console.log("Succefully connected to the mongo database.");
    app.listen(PORT , ()=>{
        console.log(`Listening to port ${PORT}`);
        console.log(userModel)
    })

})

.catch((err)=>{
    console.error(err)
    console.log("Server error")
})

app.post('/user/register' , async (req , res)=>{

    let {username , email , password} = req.body;
try{

    if(!username || !email || !password){
        return res.status(400).json({message : "Please fill all requird fields."})
    }

    if(password.length<8){
        return res.status(400).json({message : "Password must be at least 8 characters"})
    }

    let doesUserExist = await userModel.findOne({username});
        if(doesUserExist){

            return res.status(400).json({message : "User already exist"})

        }

        else {

            let hashedPswrd = await bcrypt.hash(password , 10);

            let newUser = await userModel.create({
                username, email , password : hashedPswrd
            })
        
            return res.status(200).json({message : "Account succesfully created"})

        }



}

catch(err){

    console.error(err);
    return res.status(500).json(`Internal server error : ${err}`)

}

})

app.post('/user/login' , async (req ,res)=>{

    let {username , password} = req.body;

    try{

        if(!username || !password){
            return res.status(400).json({message : "Please fill all required fields"})
        }

        let checksUserExist = await userModel.findOne({username})
        if(!checksUserExist){
            return res.status(400).json({message : "User does not exist. Please try again."})
        }

        else {
          
            let hashedLoginPass = await bcrypt.compare(password , checksUserExist.password);
              
            if(!hashedLoginPass){

                return res.status(400).json({message : "username or passowrd does not match. Please try again."})
            }

            else{

                let accessToken = jwt.sign({username :username} , accessTokSecKey , {expiresIn: '1m'})
                let refreshToken = jwt.sign({username :username} , refreshTokSecKey , {expiresIn: '2m'})

                res.cookie('access_token' , accessToken , { maxAge: 60000})
                res.cookie('refresh_token' , refreshToken , {maxAge: 120000})

                return res.status(200).json({message : "Succefully logged in!"})
            }
        }

    }

    catch(err){

        console.error(err);
        return res.status(500).json(`Internal server error : ${err}`)

    }
})


const verifyUser = (req, res, next) => {
    let accessToken = req.cookies.access_token;

    if (!accessToken) {
        return renewToken(req, res, next);
    }

    jwt.verify(accessToken, accessTokSecKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return renewToken(req, res, next);
            } else {
                return res.status(400).json({ valid: false, message: "Invalid access token" });
            }
        } else {
            req.body.username = decoded.username;
            next();
        }
    });
};

const renewToken = (req, res, next) => {
    let refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(400).json({ valid: false, message: "Refresh token not found or expired." });
    }

    jwt.verify(refreshToken, refreshTokSecKey, (err, decoded) => {
        if (err) {
            return res.status(400).json({ valid: false, message: "Invalid refresh token" });
        } else {
            let newAccessToken = jwt.sign({ username: decoded.username }, accessTokSecKey, { expiresIn: '1m' });
            res.cookie('access_token', newAccessToken, { maxAge: 60000, httpOnly: true });
            req.body.username = decoded.username;
            next();
        }
    });
};


app.get('/bella-books/home', async (req , res)=>{

    return res.status(200).json({valid: true , message : "Authorized user!"})
})

app.post('/bella-books/add-new-book' , async (req ,res)=>{

    const {title , author , year , genre, cover , desc} = req.body;

    try{

        if(!title || !author || !year || !genre || !cover || !desc){
            return res.status(400).json({message : "Please fill all required data to add a new book"})
        }

        let checkExistingBook = await booksModel.findOne({title});

        if(checkExistingBook){
            return res.status(409).json({message : "Book already exists in our library. Thank you for your kindness!"})
        }

        else{
            const newBook = await booksModel.create({
                title , author , year , genre , cover , desc
            })

            return res.status(200).json({message : "Book donated succfully. Thank you for you donation!" , newBook})
        }

    }

    catch(err){
        console.error(err);
        return res.status(500).json(`Internal server error with adding books. : ${err}`)
    }
})

app.get('/bella-books/collection' ,verifyUser, async (req ,res)=>{
    try{

        const allBooks = await booksModel.find()

        if(allBooks.length==0){
            return res.status(404).json({message : "Currently we don't have books in our library. Please in a few days."})
        }
        else {
            return res.status(200).json(allBooks);
        }

    }

    catch(err){
        console.error(err);
        return res.status(500).json(`Internal server error fetching book collection. Please try again. : ${err}`)
    }
})

app.get('/bella-books/single-book-detail/:id', verifyUser , async (req, res) => {
    try {
        let { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid book ID format." });
        }

        const singleBook = await booksModel.findById(id);

        if (singleBook) {
            return res.status(200).json(singleBook);
        } else {
            return res.status(404).json({ message: "Can't find book. Please try again later." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Internal server error fetching book detail. Please try again.`, error: err.message });
    }
});


app.delete('/bella-books/delete-book/:id', verifyUser ,async (req, res) => {
    let { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid book ID format." });
        }

        const bookToDelete = await booksModel.findByIdAndDelete(id);

        if (bookToDelete) {
            return res.status(200).json({ message: `Book successfully deleted.` });
        } else {
            return res.status(404).json({ message: "Book not found. Unable to delete." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Internal server error deleting the book. Please try again.`, error: err.message });
    }
});


app.put('/bella-books/edit-book/:id' , verifyUser , async (req , res)=>{

    let { id } = req.params;
    const {title , author , year ,genre, cover , desc} = req.body;

    try{

        if(!title || !author || !year || !genre || !cover || !desc){
            return res.status(400).json({message : "Please fill all required data to add edited book"})
        }   
        else{  
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid book ID format." });
            }
                const editedBook = await booksModel.findByIdAndUpdate(id , req.body);

                if(!editedBook){
                    return res.status(404).json({ message: "Book not found" });
                }

                else{
                    return res.status(200).json({ message: "Book succsfully updated."});
                }
            }

    }
catch(err){

    console.error(err);
        return res.status(500).json({ message: `Internal server error adding edited book. Please try again.`, error: err.message });
}
})


