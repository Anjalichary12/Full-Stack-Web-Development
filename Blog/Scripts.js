const socket = io();

// Fetch and display posts
const postsContainer = document.getElementById('posts-container');

socket.on('newPost', (post) => {
    const postElement = document.createElement('div');
    postElement.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
    postsContainer.appendChild(postElement);
});

// Submit post form
const postForm = document.getElementById('post-form');

postForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    const title = titleInput.value;
    const content = contentInput.value;

    // Send post data to the server
    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
    });

    // Clear form inputs
    titleInput.value = '';
    contentInput.value = '';
});
