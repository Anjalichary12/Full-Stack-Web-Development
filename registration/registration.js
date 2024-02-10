const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (Make sure your MongoDB server is running)
mongoose.connect('mongodb://localhost/user-registration', { useNewUrlParser: true, useUnifiedTopology: true });

// Create User schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Create a new user
    const newUser = new User({
        username: username,
        email: email,
        password: password
    });

    // Save the user to the database
    newUser.save((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Registration Successful!');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
