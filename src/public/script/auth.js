/* eslint-disable no-unused-vars */
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse response body as JSON
    })
    .then(data => {
        // Save the token in sessionStorage or localStorage
        sessionStorage.setItem('userTemplatesMeta', JSON.stringify(data.templatesMeta));
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('templates', JSON.stringify(data.templates));
        sessionStorage.setItem('username', JSON.stringify(data.username));

        // Redirect to the home page
        if (data.isAdmin) {
            sessionStorage.setItem('redirectURL', '/admin');
            fetchProtectedResource('/admin')
        } else {
            sessionStorage.setItem('redirectURL','/home' );
            fetchProtectedResource('/home')
        }
        window.location.reload(); // Reload the page
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error during login. Please try again.');
    });
}

// Check if a redirect URL is stored in sessionStorage and redirect if present
window.onload = function() {
    const redirectURL = sessionStorage.getItem('redirectURL');
    if (redirectURL) {
    fetchProtectedResource(redirectURL);
    }
};

// Function to fetch protected resource (e.g., "home" page)
function fetchProtectedResource(url) {
    const token = sessionStorage.getItem('token');
    if (!token) {
        // Handle case when token is not available (user not logged in)
        return Promise.reject('No token available');
    }

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}` // Include the token in the Authorization header
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.text(); // Parse response body as JSON
    })
    .then(html => {

            document.open();

            document.write(html);

            document.close();

    })

    .catch(error => {
        console.error('Error:', error);
        // Handle error
    });
}
