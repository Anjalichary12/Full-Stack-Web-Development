const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/real-time-blog', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Post model
const Post = mongoose.model('Post', {
    title: String,
    content: String,
});

// Body parser middleware
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// API routes
app.get('/api/posts', async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

app.post('/api/posts', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const newPost = new Post({ title, content });
    await newPost.save();

    // Emit the new post to all connected clients
    io.emit('newPost', newPost);

    res.json(newPost);
});

// Socket.io events
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
