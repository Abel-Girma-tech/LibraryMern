const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const mongoURL = process.env.MONGO_URI;
const PORT = process.env.PORT;
const accessTokSecKey = process.env.accessTokSecKey;
const refreshTokSecKey = process.env.refreshTokSecKey;

const app = express();
const userModel = require('./models/newUserModel.js');
const booksModel = require('./models/bookCollectionModel.js');


app.use(cors({
    origin: 'https://library-mern-iby7.vercel.app', // Allow only your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed HTTP methods
    credentials: true, // Allow cookies to be sent
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(mongoURL)
    .then(() => {
        console.log("Successfully connected to the MongoDB database.");
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error(err);
        console.log("Server error");
    });

app.post('/user/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all required fields." });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters." });
        }

        const doesUserExist = await userModel.findOne({ username });
        if (doesUserExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({
            username, email, password: hashedPassword
        });

        return res.status(200).json({ message: "Account successfully created" });

    } catch (err) {
        console.error(err);
        return res.status(500).json(`Internal server error: ${err}`);
    }
});

// app.get('/', (req, res) => res.status(200).json({ message: "Backend is working" }));

app.post('/user/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User does not exist. Please try again." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Username or password does not match. Please try again." });
        }

        const accessToken = jwt.sign({ username }, accessTokSecKey, { expiresIn: '1m' });
        const refreshToken = jwt.sign({ username }, refreshTokSecKey, { expiresIn: '2m' });

        res.cookie('access_token', accessToken, { maxAge: 60000, httpOnly: true , secure: true });
        res.cookie('refresh_token', refreshToken, { maxAge: 120000, httpOnly: true , secure: true });

        return res.status(200).json({ message: "Successfully logged in!" });

    } catch (err) {
        console.error(err);
        return res.status(500).json(`Internal server error: ${err}`);
    }
});

// Define other routes and middleware here...

const verifyUser = (req, res, next) => {
    const accessToken = req.cookies.access_token;

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
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(400).json({ valid: false, message: "Refresh token not found or expired." });
    }

    jwt.verify(refreshToken, refreshTokSecKey, (err, decoded) => {
        if (err) {
            return res.status(400).json({ valid: false, message: "Invalid refresh token" });
        } else {
            const newAccessToken = jwt.sign({ username: decoded.username }, accessTokSecKey, { expiresIn: '1m' });
            res.cookie('access_token', newAccessToken, { maxAge: 60000, httpOnly: true , secure: true });
            req.body.username = decoded.username;
            next();
        }
    });
};

app.get('/bella-books/home', async (req, res) => {
    return res.status(200).json({ valid: true, message: "Authorized user!" });
});

app.post('/bella-books/add-new-book',  async (req, res) => {
    const { title, author, year, genre, cover, desc } = req.body;

    try {
        if (!title || !author || !year || !genre || !cover || !desc) {
            return res.status(400).json({ message: "Please fill all required data to add a new book" });
        }

        const existingBook = await booksModel.findOne({ title });
        if (existingBook) {
            return res.status(409).json({ message: "Book already exists in our library. Thank you for your kindness!" });
        }

        const newBook = await booksModel.create({
            title, author, year, genre, cover, desc
        });

        return res.status(200).json({ message: "Book donated successfully. Thank you for your donation!", newBook });

    } catch (err) {
        console.error(err);
        return res.status(500).json(`Internal server error with adding books: ${err}`);
    }
});

app.get('/bella-books/collection', async (req, res) => {
    try {
        const allBooks = await booksModel.find();

        if (allBooks.length === 0) {
            return res.status(404).json({ message: "Currently we don't have books in our library. Please check back in a few days." });
        } else {
            return res.status(200).json(allBooks);
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json(`Internal server error fetching book collection. Please try again: ${err}`);
    }
});

app.get('/bella-books/single-book-detail/:id', async (req, res) => {
    try {
        const { id } = req.params;

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

app.delete('/bella-books/delete-book/:id', async (req, res) => {
    const { id } = req.params;

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

app.put('/bella-books/edit-book/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, year, genre, cover, desc } = req.body;

    try {
        if (!title || !author || !year || !genre || !cover || !desc) {
            return res.status(400).json({ message: "Please fill all required data to edit the book" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid book ID format." });
        }

        const editedBook = await booksModel.findByIdAndUpdate(id, req.body);

        if (!editedBook) {
            return res.status(404).json({ message: "Book not found" });
        } else {
            return res.status(200).json({ message: "Book successfully updated." });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Internal server error editing the book. Please try again.`, error: err.message });
    }
});


app.get('/bellabooks/users', async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error getting number of users" });
    }
});


app.get('/bellabooks/latest-books', async (req, res) => {
    try {
        const latestBooks = await booksModel.find().sort({ createdAt: -1 }).limit(3);
        res.status(200).json(latestBooks);
    } catch (err) {
        console.error("Error fetching latest books:", err);
        res.status(500).json({ error: "Internal server error getting latest books" });
    }
});